import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ExitService } from '../services/exit.service';

@Controller('exits')
export class ExitController {
  constructor(private exitService: ExitService) {}

  @Get()
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10, @Query('search') search = '', @Query('clientId') clientId = '') {
    const result = await this.exitService.findAll(page, limit, search, clientId);
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
