import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { MenuItem } from './entity/MenuItem';
import { Order } from './entity/Order';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'password',
  database: process.env.DB_NAME || 'food_delivery',
  synchronize: true, // auto-creates tables in dev
  logging: false,
  entities: [MenuItem, Order],
});
