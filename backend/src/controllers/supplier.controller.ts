import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { SupplierService } from '../services/supplier.service';

@Controller('suppliers')
export class SupplierController {
  constructor(private supplierService: SupplierService) {}

  @Get('active')
  async findActive() {
    return this.supplierService.findActive();
  }

  @Get()
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10, @Query('search') search = '') {
    const result = await this.supplierService.findAll(page, limit, search);
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
    return this.supplierService.findById(id);
  }

  @Post()
  async create(@Body() body: any) {
    return this.supplierService.create(body.name, body.contact, body.phone, body.email, body.address, body.paymentTerms);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.supplierService.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.supplierService.delete(id);
  }
}
