import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';

import { User } from './entities/user.entity';
import { Category } from './entities/category.entity';
import { Unit } from './entities/unit.entity';
import { Product } from './entities/product.entity';
import { Supplier } from './entities/supplier.entity';
import { Client } from './entities/client.entity';
import { Entry } from './entities/entry.entity';
import { EntryItem } from './entities/entry-item.entity';
import { Exit } from './entities/exit.entity';
import { ExitItem } from './entities/exit-item.entity';
import { Audit } from './entities/audit.entity';
import { Configuration } from './entities/configuration.entity';

import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { ProductService } from './services/product.service';
import { CategoryService } from './services/category.service';
import { UnitService } from './services/unit.service';
import { SupplierService } from './services/supplier.service';
import { ClientService } from './services/client.service';
import { EntryService } from './services/entry.service';
import { ExitService } from './services/exit.service';
import { ConfigurationService } from './services/configuration.service';

import { AuthController } from './controllers/auth.controller';
import { UserController } from './controllers/user.controller';
import { ProductController } from './controllers/product.controller';
import { CategoryController } from './controllers/category.controller';
import { UnitController } from './controllers/unit.controller';
import { SupplierController } from './controllers/supplier.controller';
import { ClientController } from './controllers/client.controller';
import { EntryController } from './controllers/entry.controller';
import { ExitController } from './controllers/exit.controller';
import { ConfigurationController } from './controllers/configuration.controller';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'distribuidora',
      entities: [User, Category, Unit, Product, Supplier, Client, Entry, EntryItem, Exit, ExitItem, Audit, Configuration],
      synchronize: true,
      logging: false,
    }),
    TypeOrmModule.forFeature([User, Category, Unit, Product, Supplier, Client, Entry, EntryItem, Exit, ExitItem, Audit, Configuration]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: undefined },
    }),
  ],
  providers: [AuthService, UserService, ProductService, CategoryService, UnitService, SupplierService, ClientService, EntryService, ExitService, ConfigurationService],
  controllers: [AuthController, UserController, ProductController, CategoryController, UnitController, SupplierController, ClientController, EntryController, ExitController, ConfigurationController],
})
export class AppModule {}
