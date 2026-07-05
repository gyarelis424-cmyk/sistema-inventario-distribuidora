import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ExitService } from '../services/exit.service';

@Controller('api/exits')
export class ExitController {
  constructor(private exitService: ExitService) {}

  @Get('stats/monthly')
  async getMonthlyExits() {
    return await this.exitService.getMonthlyExits();
  }

  @Get('stats/total-monthly')
  async getTotalMonthlySales() {
    return await this.exitService.getTotalMonthlySales();
  }

  @Get()
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10, @Query('search') search = '', @Query('clientId') clientId = '') {
    return this.exitService.findAll(page, limit, search, clientId);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.exitService.findById(id);
  }

  @Post()
  async create(@Body() body: any) {
    return this.exitService.create(body.clientId, body.documentNumber, new Date(body.exitDate), body.items);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.exitService.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.exitService.delete(id);
  }
}
