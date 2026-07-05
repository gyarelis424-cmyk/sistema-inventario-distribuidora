import { Controller, Get, Put, Body } from '@nestjs/common';
import { ConfigurationService } from '../services/configuration.service';

@Controller('api/configuration')
export class ConfigurationController {
  constructor(private configurationService: ConfigurationService) {}

  @Get()
  async getConfiguration() {
    return this.configurationService.getConfiguration();
  }

  @Put()
  async updateConfiguration(@Body() body: any) {
    return this.configurationService.updateConfiguration(body);
  }
}
