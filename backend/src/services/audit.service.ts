import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Audit } from '../entities/audit.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(Audit)
    private auditRepository: Repository<Audit>,
  ) {}

  async findAll(page = 1, limit = 10, search = '') {
    const query = this.auditRepository.createQueryBuilder('audit').leftJoinAndSelect('audit.user', 'user');

    if (search) {
      query.where('audit.action ILIKE :search OR audit.module ILIKE :search OR audit.description ILIKE :search', { search: `%${search}%` });
    }

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('audit.createdAt', 'DESC')
      .getManyAndCount();

    return { data, total, page, limit };
  }

  async log(action: string, module: string, userId?: string, description?: string, changes?: any) {
    const audit = this.auditRepository.create({
      action,
      module,
      userId,
      description,
      changes,
    });

    return await this.auditRepository.save(audit);
  }
}
