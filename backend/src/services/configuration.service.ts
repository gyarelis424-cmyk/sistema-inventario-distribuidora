import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Configuration } from '../entities/configuration.entity';

@Injectable()
export class ConfigurationService {
  constructor(
    @InjectRepository(Configuration)
    private configRepository: Repository<Configuration>,
  ) {}

  async getConfiguration() {
    let config = await this.configRepository.findOne({ where: {} });

    if (!config) {
      config = this.configRepository.create({
        companyName: 'Distribuidora S.A.',
        currency: 'NIO',
        timezone: 'America/Managua',
        timeFormat: '24h',
        dateFormat: 'dd/MM/yyyy',
      });
      config = await this.configRepository.save(config);
    }

    return config;
  }

  async updateConfiguration(updates: Partial<Configuration>) {
    let config = await this.configRepository.findOne({ where: {} });

    if (!config) {
      config = this.configRepository.create(updates);
    } else {
      Object.assign(config, updates);
    }

    return await this.configRepository.save(config);
  }
}