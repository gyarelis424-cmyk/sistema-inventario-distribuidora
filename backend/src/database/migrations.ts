import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { Unit } from '../entities/unit.entity';
import { Supplier } from '../entities/supplier.entity';
import { Client } from '../entities/client.entity';
import { Entry } from '../entities/entry.entity';
import { EntryItem } from '../entities/entry-item.entity';
import { Exit } from '../entities/exit.entity';
import { ExitItem } from '../entities/exit-item.entity';
import { Audit } from '../entities/audit.entity';
import { Configuration } from '../entities/configuration.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'distribuidora',
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV !== 'production',
  entities: [
    User,
    Product,
    Category,
    Unit,
    Supplier,
    Client,
    Entry,
    EntryItem,
    Exit,
    ExitItem,
    Audit,
    Configuration,
  ],
});
