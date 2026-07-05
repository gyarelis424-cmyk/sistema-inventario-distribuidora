import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async findAll(page = 1, limit = 10) {
    const [data, total] = await this.categoriesRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { data, total, page, limit };
  }

  async findById(id: string) {
    const category = await this.categoriesRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async create(name: string, description?: string) {
    const existingCategory = await this.categoriesRepository.findOne({ where: { name } });
    if (existingCategory) {
      throw new BadRequestException('Category name already exists');
    }

    const category = this.categoriesRepository.create({
      name,
      description,
      status: 'Activo',
    });

    return await this.categoriesRepository.save(category);
  }

  async update(id: string, updates: any) {
    const category = await this.categoriesRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    Object.assign(category, updates);
    return await this.categoriesRepository.save(category);
  }

  async delete(id: string) {
    const category = await this.categoriesRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    await this.categoriesRepository.remove(category);
    return { message: 'Category deleted' };
  }

  async findActive() {
    return await this.categoriesRepository.find({
      where: { status: 'Activo' },
      order: { name: 'ASC' },
    });
  }
}
