import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { UnitService } from '../services/unit.service';

@Controller('api/units')
export class UnitController {
  constructor(private unitService: UnitService) {}

  @Get('active')
  async findActive() {
    return this.unitService.findActive();
  }

  @Get()
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.unitService.findAll(page, limit);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.unitService.findById(id);
  }

  @Post()
  async create(@Body() body: { name: string; abbreviation: string; description?: string }) {
    return this.unitService.create(body.name, body.abbreviation, body.description);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.unitService.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.unitService.delete(id);
  }
}
