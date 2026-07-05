import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async findAll(page = 1, limit = 10, search = '', categoryId = '', status = '') {
    const query = this.productsRepository.createQueryBuilder('product').leftJoinAndSelect('product.category', 'category').leftJoinAndSelect('product.unit', 'unit');

    if (search) {
      query.where('product.code ILIKE :search OR product.name ILIKE :search', { search: `%${search}%` });
    }

    if (categoryId) {
      query.andWhere('product.categoryId = :categoryId', { categoryId });
    }

    if (status) {
      query.andWhere('product.status = :status', { status });
    }

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('product.createdAt', 'DESC')
      .getManyAndCount();

    return { data, total, page, limit };
  }

  async findById(id: string) {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['category', 'unit'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async create(code: string, name: string, price: number, categoryId: string, unitId: string, minimumStock: number, description?: string, imageUrl?: string) {
    const existingProduct = await this.productsRepository.findOne({ where: { code } });
    if (existingProduct) {
      throw new BadRequestException('Product code already exists');
    }

    const product = this.productsRepository.create({
      code,
      name,
      price,
      categoryId,
      unitId,
      minimumStock,
      description,
      imageUrl,
      currentStock: 0,
      status: 'Activo',
    });

    return await this.productsRepository.save(product);
  }

  async update(id: string, updates: any) {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    Object.assign(product, updates);
    return await this.productsRepository.save(product);
  }

  async updateStock(id: string, newStock: number) {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    product.currentStock = newStock;
    return await this.productsRepository.save(product);
  }

  async delete(id: string) {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.productsRepository.remove(product);
    return { message: 'Product deleted' };
  }

  async getTotalProducts() {
    return await this.productsRepository.count();
  }

  async getTotalStock() {
    const result = await this.productsRepository
      .createQueryBuilder('product')
      .select('SUM(product.currentStock)', 'total')
      .getRawOne();

    return parseFloat(result.total) || 0;
  }

  async getStockByCategory() {
    return await this.productsRepository
      .createQueryBuilder('product')
      .select('category.name', 'category')
      .addSelect('SUM(product.currentStock)', 'total')
      .leftJoin('product.category', 'category')
      .groupBy('category.id')
      .addGroupBy('category.name')
      .getRawMany();
  }
}
