import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { EntriesModule } from './modules/entries/entries.module';
import { ExitsModule } from './modules/exits/exits.module';
import { ProvidersModule } from './modules/providers/providers.module';
import { CustomersModule } from './modules/customers/customers.module';
import { ReportsModule } from './modules/reports/reports.module';
import { ConfigurationModule } from './modules/configuration/configuration.module';

@Module({
  imports: [AuthModule, UsersModule, ProductsModule, EntriesModule, ExitsModule, ProvidersModule, CustomersModule, ReportsModule, ConfigurationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
