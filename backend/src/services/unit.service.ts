import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Unit } from '../entities/unit.entity';

@Injectable()
export class UnitService {
  constructor(
    @InjectRepository(Unit)
    private unitsRepository: Repository<Unit>,
  ) {}

  async findAll(page = 1, limit = 10) {
    const [data, total] = await this.unitsRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { data, total, page, limit };
  }

  async findById(id: string) {
    const unit = await this.unitsRepository.findOne({ where: { id } });
    if (!unit) {
      throw new NotFoundException('Unit not found');
    }
    return unit;
  }

  async create(name: string, abbreviation: string, description?: string) {
    const existingUnit = await this.unitsRepository.findOne({ where: { abbreviation } });
    if (existingUnit) {
      throw new BadRequestException('Unit abbreviation already exists');
    }

    const unit = this.unitsRepository.create({
      name,
      abbreviation,
      description,
      status: 'Activo',
    });

    return await this.unitsRepository.save(unit);
  }

  async update(id: string, updates: any) {
    const unit = await this.unitsRepository.findOne({ where: { id } });
    if (!unit) {
      throw new NotFoundException('Unit not found');
    }

    Object.assign(unit, updates);
    return await this.unitsRepository.save(unit);
  }

  async delete(id: string) {
    const unit = await this.unitsRepository.findOne({ where: { id } });
    if (!unit) {
      throw new NotFoundException('Unit not found');
    }

    await this.unitsRepository.remove(unit);
    return { message: 'Unit deleted' };
  }

  async findActive() {
    return await this.unitsRepository.find({
      where: { status: 'Activo' },
      order: { name: 'ASC' },
    });
  }
}
