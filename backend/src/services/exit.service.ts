import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Exit } from '../entities/exit.entity';
import { ExitItem } from '../entities/exit-item.entity';
import { Product } from '../entities/product.entity';

@Injectable()
export class ExitService {
  constructor(
    @InjectRepository(Exit)
    private exitsRepository: Repository<Exit>,
    @InjectRepository(ExitItem)
    private exitItemsRepository: Repository<ExitItem>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private dataSource: DataSource,
  ) {}

  async findAll(page = 1, limit = 10, search = '', clientId = '') {
    const query = this.exitsRepository
      .createQueryBuilder('exit')
      .leftJoinAndSelect('exit.client', 'client')
      .leftJoinAndSelect('exit.items', 'items')
      .leftJoinAndSelect('items.product', 'product');

    if (search) {
      query.where('exit.exitNumber ILIKE :search OR exit.documentNumber ILIKE :search', { search: `%${search}%` });
    }

    if (clientId) {
      query.andWhere('exit.clientId = :clientId', { clientId });
    }

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('exit.exitDate', 'DESC')
      .getManyAndCount();

    return { data, total, page, limit };
  }

  async findById(id: string) {
    const exit = await this.exitsRepository.findOne({
      where: { id },
      relations: ['client', 'items', 'items.product'],
    });

    if (!exit) {
      throw new NotFoundException('Exit not found');
    }

    return exit;
  }

  async create(clientId: string, documentNumber: string, exitDate: Date, items: Array<{ productId: string; quantity: number; unitPrice: number }>) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const exitNumber = `S-${Date.now()}`;
      let totalAmount = 0;

      for (const item of items) {
        const product = await queryRunner.manager.findOne(Product, { where: { id: item.productId } });
        if (!product) {
          throw new BadRequestException(`Product ${item.productId} not found`);
        }

        if (parseFloat(product.currentStock.toString()) < item.quantity) {
          throw new BadRequestException(`Insufficient stock for product ${product.name}`);
        }
      }

      const exit = this.exitsRepository.create({
        exitNumber,
        documentNumber,
        exitDate,
        clientId,
        status: 'Completado',
      });

      const savedExit = await queryRunner.manager.save(exit);

      for (const item of items) {
        const product = await queryRunner.manager.findOne(Product, { where: { id: item.productId } });

        const subtotal = parseFloat((item.quantity * item.unitPrice).toFixed(2));
        totalAmount += subtotal;

        const exitItem = this.exitItemsRepository.create({
          exitId: savedExit.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subtotal,
        });

        await queryRunner.manager.save(exitItem);

        product.currentStock = parseFloat((parseFloat(product.currentStock.toString()) - item.quantity).toFixed(2));
        await queryRunner.manager.save(product);
      }

      savedExit.totalAmount = totalAmount;
      await queryRunner.manager.save(savedExit);

      await queryRunner.commitTransaction();
      return this.findById(savedExit.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: string, updates: any) {
    const exit = await this.exitsRepository.findOne({ where: { id } });
    if (!exit) {
      throw new NotFoundException('Exit not found');
    }

    Object.assign(exit, updates);
    return await this.exitsRepository.save(exit);
  }

  async delete(id: string) {
    const exit = await this.exitsRepository.findOne({ where: { id }, relations: ['items'] });
    if (!exit) {
      throw new NotFoundException('Exit not found');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const item of exit.items) {
        const product = await queryRunner.manager.findOne(Product, { where: { id: item.productId } });
        if (product) {
          product.currentStock = parseFloat((parseFloat(product.currentStock.toString()) + item.quantity).toFixed(2));
          await queryRunner.manager.save(product);
        }
      }

      await queryRunner.manager.remove(exit.items);
      await queryRunner.manager.remove(exit);

      await queryRunner.commitTransaction();
      return { message: 'Exit deleted' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getMonthlyExits() {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    return await this.exitsRepository
      .createQueryBuilder('exit')
      .select('DATE_TRUNC(\'month\', exit.exitDate)', 'month')
      .addSelect('COUNT(*)', 'count')
      .where('exit.exitDate >= :date', { date: sixMonthsAgo })
      .groupBy('DATE_TRUNC(\'month\', exit.exitDate)')
      .orderBy('month', 'ASC')
      .getRawMany();
  }

  async getTotalMonthlySales() {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const result = await this.exitsRepository
      .createQueryBuilder('exit')
      .select('COUNT(*)', 'count')
      .addSelect('SUM(exit.totalAmount)', 'total')
      .where('exit.exitDate >= :startOfMonth', { startOfMonth })
      .getRawOne();

    return { count: parseInt(result.count) || 0, total: parseFloat(result.total) || 0 };
  }
}
