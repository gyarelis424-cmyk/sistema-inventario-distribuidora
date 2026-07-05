import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from '../entities/client.entity';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
  ) {}

  async findAll(page = 1, limit = 10, search = '') {
    const query = this.clientsRepository.createQueryBuilder('client');

    if (search) {
      query.where('client.name ILIKE :search OR client.email ILIKE :search', { search: `%${search}%` });
    }

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('client.createdAt', 'DESC')
      .getManyAndCount();

    return { data, total, page, limit };
  }

  async findById(id: string) {
    const client = await this.clientsRepository.findOne({ where: { id } });
    if (!client) {
      throw new NotFoundException('Client not found');
    }
    return client;
  }

  async create(name: string, contact?: string, phone?: string, email?: string, address?: string, creditLimit: number = 0) {
    const existingClient = await this.clientsRepository.findOne({ where: { name } });
    if (existingClient) {
      throw new BadRequestException('Client name already exists');
    }

    const client = this.clientsRepository.create({
      name,
      contact,
      phone,
      email,
      address,
      creditLimit,
      creditUsed: 0,
      status: 'Activo',
    });

    return await this.clientsRepository.save(client);
  }

  async update(id: string, updates: any) {
    const client = await this.clientsRepository.findOne({ where: { id } });
    if (!client) {
      throw new NotFoundException('Client not found');
    }

    Object.assign(client, updates);
    return await this.clientsRepository.save(client);
  }

  async delete(id: string) {
    const client = await this.clientsRepository.findOne({ where: { id } });
    if (!client) {
      throw new NotFoundException('Client not found');
    }

    await this.clientsRepository.remove(client);
    return { message: 'Client deleted' };
  }

  async findActive() {
    return await this.clientsRepository.find({
      where: { status: 'Activo' },
      order: { name: 'ASC' },
    });
  }

  async updateCreditUsed(id: string, amount: number) {
    const client = await this.clientsRepository.findOne({ where: { id } });
    if (!client) {
      throw new NotFoundException('Client not found');
    }

    client.creditUsed = amount;
    return await this.clientsRepository.save(client);
  }
}
