import { DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  
  url: process.env.DATABASE_URL,
  entities: [
    'backend/src/entities/**/*.entity.ts',
    'backend/dist/entities/**/*.entity.js',
  ],
  migrations: [
    'backend/src/migrations/**/*.ts',
    'backend/dist/migrations/**/*.js',
  ],
  
  synchronize: !isProduction,
  logging: !isProduction,
  
  ssl: { 
    rejectUnauthorized: false 
  },
};