import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { EntryService } from '../services/entry.service';

@Controller('entries')
export class EntryController {
  constructor(private entryService: EntryService) {}

  @Get()
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10, @Query('search') search = '', @Query('supplierId') supplierId = '') {
    const result = await this.entryService.findAll(page, limit, search, supplierId);
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
    return this.entryService.findById(id);
  }

  @Post()
  async create(@Body() body: any) {
    return this.entryService.create(body.supplierId, body.documentNumber, new Date(body.entryDate), body.items);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.entryService.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.entryService.delete(id);
  }
}
