import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { Entry } from '../entities/entry.entity';
import { Exit } from '../entities/exit.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Entry)
    private entriesRepository: Repository<Entry>,
    @InjectRepository(Exit)
    private exitsRepository: Repository<Exit>,
  ) {}

  async getStats() {
    const totalProducts = await this.productsRepository.count();

    const stockResult = await this.productsRepository
      .createQueryBuilder('product')
      .select('SUM(product.currentStock)', 'total')
      .getRawOne();
    const totalStock = parseFloat(stockResult.total) || 0;

    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const monthlyEntriesResult = await this.entriesRepository
      .createQueryBuilder('entry')
      .select('COUNT(*)', 'count')
      .where('entry.entryDate >= :startOfMonth', { startOfMonth })
      .getRawOne();
    const monthlyEntries = parseInt(monthlyEntriesResult.count) || 0;

    const monthlyExitsResult = await this.exitsRepository
      .createQueryBuilder('exit')
      .select('COUNT(*)', 'count')
      .where('exit.exitDate >= :startOfMonth', { startOfMonth })
      .getRawOne();
    const monthlyExits = parseInt(monthlyExitsResult.count) || 0;

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const entriesData = await this.entriesRepository
      .createQueryBuilder('entry')
      .select('TO_CHAR(entry.entryDate, \'Mon YYYY\')', 'month')
      .addSelect('COUNT(*)', 'entries')
      .where('entry.entryDate >= :sixMonthsAgo', { sixMonthsAgo })
      .groupBy('TO_CHAR(entry.entryDate, \'Mon YYYY\')')
      .addGroupBy('DATE_TRUNC(\'month\', entry.entryDate)')
      .orderBy('DATE_TRUNC(\'month\', entry.entryDate)', 'ASC')
      .getRawMany();

    const exitsData = await this.exitsRepository
      .createQueryBuilder('exit')
      .select('TO_CHAR(exit.exitDate, \'Mon YYYY\')', 'month')
      .addSelect('COUNT(*)', 'exits')
      .where('exit.exitDate >= :sixMonthsAgo', { sixMonthsAgo })
      .groupBy('TO_CHAR(exit.exitDate, \'Mon YYYY\')')
      .addGroupBy('DATE_TRUNC(\'month\', exit.exitDate)')
      .orderBy('DATE_TRUNC(\'month\', exit.exitDate)', 'ASC')
      .getRawMany();

    const movementsByMonth: Map<string, any> = new Map();

    entriesData.forEach(e => {
      const existing = movementsByMonth.get(e.month) || { month: e.month, entries: 0, exits: 0 };
      existing.entries = parseInt(e.entries) || 0;
      movementsByMonth.set(e.month, existing);
    });

    exitsData.forEach(e => {
      const existing = movementsByMonth.get(e.month) || { month: e.month, entries: 0, exits: 0 };
      existing.exits = parseInt(e.exits) || 0;
      movementsByMonth.set(e.month, existing);
    });

    const movementsSixMonths = Array.from(movementsByMonth.values());

    const stockByCategory = await this.productsRepository
      .createQueryBuilder('product')
      .select('category.name', 'category')
      .addSelect('SUM(product.currentStock)', 'stock')
      .leftJoin('product.category', 'category')
      .groupBy('category.id')
      .addGroupBy('category.name')
      .orderBy('category.name', 'ASC')
      .getRawMany()
      .then(results =>
        results.map(r => ({
          category: r.category,
          stock: parseFloat(r.stock) || 0,
        }))
      );

    return {
      totalProducts,
      totalStock,
      monthlyEntries,
      monthlyExits,
      movementsSixMonths,
      stockByCategory,
    };
  }
}
