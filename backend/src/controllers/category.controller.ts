import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { CategoryService } from '../services/category.service';

@Controller('api/categories')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get('active')
  async findActive() {
    return this.categoryService.findActive();
  }

  @Get()
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    const result = await this.categoryService.findAll(page, limit);
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
    return this.categoryService.findById(id);
  }

  @Post()
  async create(@Body() body: { name: string; description?: string }) {
    return this.categoryService.create(body.name, body.description);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.categoryService.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.categoryService.delete(id);
  }
}
