import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Supplier } from '../entities/supplier.entity';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(Supplier)
    private suppliersRepository: Repository<Supplier>,
  ) {}

  async findAll(page = 1, limit = 10, search = '') {
    const query = this.suppliersRepository.createQueryBuilder('supplier');

    if (search) {
      query.where('supplier.name ILIKE :search OR supplier.email ILIKE :search', { search: `%${search}%` });
    }

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('supplier.createdAt', 'DESC')
      .getManyAndCount();

    return { data, total, page, limit };
  }

  async findById(id: string) {
    const supplier = await this.suppliersRepository.findOne({ where: { id } });
    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }
    return supplier;
  }

  async create(name: string, contact?: string, phone?: string, email?: string, address?: string, paymentTerms?: string) {
    const existingSupplier = await this.suppliersRepository.findOne({ where: { name } });
    if (existingSupplier) {
      throw new BadRequestException('Supplier name already exists');
    }

    const supplier = this.suppliersRepository.create({
      name,
      contact,
      phone,
      email,
      address,
      paymentTerms,
      status: 'Activo',
    });

    return await this.suppliersRepository.save(supplier);
  }

  async update(id: string, updates: any) {
    const supplier = await this.suppliersRepository.findOne({ where: { id } });
    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }

    Object.assign(supplier, updates);
    return await this.suppliersRepository.save(supplier);
  }

  async delete(id: string) {
    const supplier = await this.suppliersRepository.findOne({ where: { id } });
    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }

    await this.suppliersRepository.remove(supplier);
    return { message: 'Supplier deleted' };
  }

  async findActive() {
    return await this.suppliersRepository.find({
      where: { status: 'Activo' },
      order: { name: 'ASC' },
    });
  }
}
