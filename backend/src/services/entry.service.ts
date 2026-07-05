import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Entry } from '../entities/entry.entity';
import { EntryItem } from '../entities/entry-item.entity';
import { Product } from '../entities/product.entity';
import { ValidationService } from './validation.service';

@Injectable()
export class EntryService {
  constructor(
    @InjectRepository(Entry)
    private entriesRepository: Repository<Entry>,
    @InjectRepository(EntryItem)
    private entryItemsRepository: Repository<EntryItem>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private dataSource: DataSource,
  ) {}

  async findAll(page = 1, limit = 10, search = '', supplierId = '') {
    const query = this.entriesRepository
      .createQueryBuilder('entry')
      .leftJoinAndSelect('entry.supplier', 'supplier')
      .leftJoinAndSelect('entry.items', 'items')
      .leftJoinAndSelect('items.product', 'product');

    if (search) {
      query.where('entry.entryNumber ILIKE :search OR entry.documentNumber ILIKE :search', { search: `%${search}%` });
    }

    if (supplierId) {
      query.andWhere('entry.supplierId = :supplierId', { supplierId });
    }

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('entry.entryDate', 'DESC')
      .getManyAndCount();

    return { data, total, page, limit };
  }

  async findById(id: string) {
    const entry = await this.entriesRepository.findOne({
      where: { id },
      relations: ['supplier', 'items', 'items.product'],
    });

    if (!entry) {
      throw new NotFoundException('Entry not found');
    }

    return entry;
  }

  async create(supplierId: string, documentNumber: string, entryDate: Date, items: Array<{ productId: string; quantity: number; unitPrice: number }>) {
    // Validations
    ValidationService.validateRequired(supplierId, 'Proveedor');
    ValidationService.validateRequired(documentNumber, 'Número de documento');
    ValidationService.validateArrayNotEmpty(items, 'Productos');
    
    if (!ValidationService.isValidDocumentNumber(documentNumber)) {
      throw new BadRequestException('Formato de número de documento inválido');
    }

    ValidationService.validateDateNotFuture(entryDate, 'Fecha de entrada');

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const entryNumber = `E-${Date.now()}`;
      let totalAmount = 0;

      const entry = this.entriesRepository.create({
        entryNumber,
        documentNumber,
        entryDate,
        supplierId,
        status: 'Completado',
      });

      const savedEntry = await queryRunner.manager.save(entry);

      for (const item of items) {
        // Validate item
        ValidationService.validateQuantity(item.quantity, 'Cantidad de producto');
        ValidationService.validatePrice(item.unitPrice, 'Precio unitario');

        const product = await queryRunner.manager.findOne(Product, { where: { id: item.productId } });
        if (!product) {
          throw new BadRequestException(`Producto ${item.productId} no encontrado`);
        }

        const subtotal = parseFloat((item.quantity * item.unitPrice).toFixed(2));
        totalAmount += subtotal;

        const entryItem = this.entryItemsRepository.create({
          entryId: savedEntry.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subtotal,
        });

        await queryRunner.manager.save(entryItem);

        product.currentStock = parseFloat((parseFloat(product.currentStock.toString()) + item.quantity).toFixed(2));
        await queryRunner.manager.save(product);
      }

      savedEntry.totalAmount = totalAmount;
      await queryRunner.manager.save(savedEntry);

      await queryRunner.commitTransaction();
      return this.findById(savedEntry.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: string, updates: any) {
    const entry = await this.entriesRepository.findOne({ where: { id } });
    if (!entry) {
      throw new NotFoundException('Entry not found');
    }

    Object.assign(entry, updates);
    return await this.entriesRepository.save(entry);
  }

  async delete(id: string) {
    const entry = await this.entriesRepository.findOne({ where: { id }, relations: ['items'] });
    if (!entry) {
      throw new NotFoundException('Entry not found');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const item of entry.items) {
        const product = await queryRunner.manager.findOne(Product, { where: { id: item.productId } });
        if (product) {
          product.currentStock = parseFloat((parseFloat(product.currentStock.toString()) - item.quantity).toFixed(2));
          await queryRunner.manager.save(product);
        }
      }

      await queryRunner.manager.remove(entry.items);
      await queryRunner.manager.remove(entry);

      await queryRunner.commitTransaction();
      return { message: 'Entry deleted' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getMonthlyEntries() {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    return await this.entriesRepository
      .createQueryBuilder('entry')
      .select('DATE_TRUNC(\'month\', entry.entryDate)', 'month')
      .addSelect('COUNT(*)', 'count')
      .where('entry.entryDate >= :date', { date: sixMonthsAgo })
      .groupBy('DATE_TRUNC(\'month\', entry.entryDate)')
      .orderBy('month', 'ASC')
      .getRawMany();
  }

  async getTotalMonthlyEntries() {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const result = await this.entriesRepository
      .createQueryBuilder('entry')
      .select('COUNT(*)', 'count')
      .addSelect('SUM(entry.totalAmount)', 'total')
      .where('entry.entryDate >= :startOfMonth', { startOfMonth })
      .getRawOne();

    return { count: parseInt(result.count) || 0, total: parseFloat(result.total) || 0 };
  }
}
