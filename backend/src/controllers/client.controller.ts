import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ClientService } from '../services/client.service';

@Controller('api/clients')
export class ClientController {
  constructor(private clientService: ClientService) {}

  @Get('active')
  async findActive() {
    return this.clientService.findActive();
  }

  @Get()
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10, @Query('search') search = '') {
    const result = await this.clientService.findAll(page, limit, search);
    return {
      data: result.data,
      meta: {
        total: result.total,
        page: result.page,
        lastPage: Math.ceil(result.total / result.limit),
      },
    };
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.clientService.findById(id);
  }

  @Post()
  async create(@Body() body: any) {
    return this.clientService.create(body.name, body.contact, body.phone, body.email, body.address, body.creditLimit);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.clientService.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.clientService.delete(id);
  }
}
