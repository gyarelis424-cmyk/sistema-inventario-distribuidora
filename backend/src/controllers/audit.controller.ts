import { Controller, Get, Query } from '@nestjs/common';
import { AuditService } from '../services/audit.service';

@Controller('api/audit')
export class AuditController {
  constructor(private auditService: AuditService) {}

  @Get('logs')
  async getLogs(@Query('page') page = 1, @Query('limit') limit = 10, @Query('search') search = '') {
    const result = await this.auditService.findAll(page, limit, search);
    return {
      data: result.data,
      meta: {
        total: result.total,
        page: result.page,
        lastPage: Math.ceil(result.total / result.limit),
      },
    };
  }
}
