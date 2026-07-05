import { Injectable } from '@nestjs/common';
import { Repository, Between } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Entry } from '../entities/entry.entity';
import { Exit } from '../entities/exit.entity';
import { Product } from '../entities/product.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Entry)
    private entriesRepository: Repository<Entry>,
    @InjectRepository(Exit)
    private exitsRepository: Repository<Exit>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getInventoryReport(filters: any) {
    const { categoryId, status, search, page = 1, limit = 10 } = filters;

    const query = this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.unit', 'unit');

    if (search) {
      query.where('product.name ILIKE :search OR product.code ILIKE :search', { search: `%${search}%` });
    }

    if (categoryId) {
      query.andWhere('product.categoryId = :categoryId', { categoryId });
    }

    if (status) {
      if (status === 'low_stock') {
        query.andWhere('product.currentStock <= product.minimumStock');
      } else if (status === 'out_of_stock') {
        query.andWhere('product.currentStock = 0');
      }
    }

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('product.createdAt', 'DESC')
      .getManyAndCount();

    return { data, total, page, limit };
  }

  async getEntriesReport(filters: any) {
    const { supplierId, startDate, endDate, page = 1, limit = 10 } = filters;

    const query = this.entriesRepository
      .createQueryBuilder('entry')
      .leftJoinAndSelect('entry.supplier', 'supplier')
      .leftJoinAndSelect('entry.items', 'items')
      .leftJoinAndSelect('items.product', 'product');

    if (supplierId) {
      query.where('entry.supplierId = :supplierId', { supplierId });
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59);

      query.andWhere('entry.entryDate BETWEEN :start AND :end', { start, end });
    }

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('entry.entryDate', 'DESC')
      .getManyAndCount();

    return { data, total, page, limit };
  }

  async getExitsReport(filters: any) {
    const { clientId, startDate, endDate, page = 1, limit = 10 } = filters;

    const query = this.exitsRepository
      .createQueryBuilder('exit')
      .leftJoinAndSelect('exit.client', 'client')
      .leftJoinAndSelect('exit.items', 'items')
      .leftJoinAndSelect('items.product', 'product');

    if (clientId) {
      query.where('exit.clientId = :clientId', { clientId });
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59);

      query.andWhere('exit.exitDate BETWEEN :start AND :end', { start, end });
    }

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('exit.exitDate', 'DESC')
      .getManyAndCount();

    return { data, total, page, limit };
  }

  async getSalesReport(filters: any) {
    const { startDate, endDate, groupBy = 'day' } = filters;

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59);

    const query = this.exitsRepository
      .createQueryBuilder('exit')
      .leftJoinAndSelect('exit.items', 'items')
      .where('exit.exitDate BETWEEN :start AND :end', { start, end })
      .orderBy('exit.exitDate', 'DESC');

    const exits = await query.getMany();

    const grouped: any = {};
    exits.forEach((exit) => {
      let key: string;

      if (groupBy === 'month') {
        key = exit.exitDate.toLocaleDateString('es-NI', { year: 'numeric', month: '2-digit' });
      } else if (groupBy === 'week') {
        const startOfWeek = new Date(exit.exitDate);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        key = startOfWeek.toISOString().split('T')[0];
      } else {
        key = exit.exitDate.toISOString().split('T')[0];
      }

      if (!grouped[key]) {
        grouped[key] = { date: key, totalItems: 0, transactionCount: 0, totalValue: 0 };
      }

      grouped[key].transactionCount++;
      exit.items.forEach((item) => {
        grouped[key].totalItems += item.quantity;
        grouped[key].totalValue += item.quantity * item.unitPrice;
      });
    });

    return Object.values(grouped);
  }

  async getProductMovementReport(productId: string, filters: any) {
    const { startDate, endDate } = filters;

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59);

    const entries = await this.entriesRepository
      .createQueryBuilder('entry')
      .leftJoinAndSelect('entry.items', 'items')
      .where('items.productId = :productId', { productId })
      .andWhere('entry.entryDate BETWEEN :start AND :end', { start, end })
      .orderBy('entry.entryDate', 'ASC')
      .getMany();

    const exits = await this.exitsRepository
      .createQueryBuilder('exit')
      .leftJoinAndSelect('exit.items', 'items')
      .where('items.productId = :productId', { productId })
      .andWhere('exit.exitDate BETWEEN :start AND :end', { start, end })
      .orderBy('exit.exitDate', 'ASC')
      .getMany();

    return {
      entries: entries.map((e) => ({
        type: 'ENTRADA',
        date: e.entryDate,
        quantity: e.items.reduce((sum, item) => sum + item.quantity, 0),
        reference: e.documentNumber,
      })),
      exits: exits.map((e) => ({
        type: 'SALIDA',
        date: e.exitDate,
        quantity: e.items.reduce((sum, item) => sum + item.quantity, 0),
        reference: e.referenceNumber,
      })),
    };
  }
}
