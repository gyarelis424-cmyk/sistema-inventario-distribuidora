import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ProductService } from '../services/product.service';

@Controller('api/products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10, @Query('search') search = '', @Query('categoryId') categoryId = '', @Query('status') status = '') {
    const result = await this.productService.findAll(page, limit, search, categoryId, status);
    return {
      data: result.data,
      meta: {
        total: result.total,
        page: result.page,
        lastPage: Math.ceil(result.total / result.limit),
      },
    };
  }

  @Get('category/:categoryId')
  async findByCategory(@Param('categoryId') categoryId: string, @Query('page') page = 1, @Query('limit') limit = 10) {
    const result = await this.productService.findAll(page, limit, '', categoryId, '');
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
    return this.productService.findById(id);
  }

  @Post()
  async create(@Body() body: any) {
    return this.productService.create(body.code, body.name, body.price, body.categoryId, body.unitId, body.minimumStock, body.description, body.imageUrl);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.productService.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.productService.delete(id);
  }
}
