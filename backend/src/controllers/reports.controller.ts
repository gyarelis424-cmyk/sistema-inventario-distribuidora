import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from '../services/reports.service';

@Controller('api/reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('inventory')
  async getInventoryReport(@Query() filters: any) {
    return this.reportsService.getInventoryReport(filters);
  }

  @Get('entries')
  async getEntriesReport(@Query() filters: any) {
    return this.reportsService.getEntriesReport(filters);
  }

  @Get('exits')
  async getExitsReport(@Query() filters: any) {
    return this.reportsService.getExitsReport(filters);
  }

  @Get('sales')
  async getSalesReport(@Query() filters: any) {
    return this.reportsService.getSalesReport(filters);
  }

  @Get('product-movement/:productId')
  async getProductMovementReport(@Query('productId') productId: string, @Query() filters: any) {
    return this.reportsService.getProductMovementReport(productId, filters);
  }
}
