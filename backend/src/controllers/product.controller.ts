import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ProductService } from '../services/product.service';

@Controller('api/products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('stats/total')
  async getTotalProducts() {
    return { total: await this.productService.getTotalProducts() };
  }

  @Get('stats/stock')
  async getTotalStock() {
    return { total: await this.productService.getTotalStock() };
  }

  @Get('stats/by-category')
  async getStockByCategory() {
    return await this.productService.getStockByCategory();
  }

  @Get()
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10, @Query('search') search = '', @Query('categoryId') categoryId = '', @Query('status') status = '') {
    return this.productService.findAll(page, limit, search, categoryId, status);
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
