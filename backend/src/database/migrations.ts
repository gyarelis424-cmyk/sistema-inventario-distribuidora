import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

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


dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
 
  synchronize: !isProduction,
  logging: !isProduction,

  ssl: { rejectUnauthorized: false },
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