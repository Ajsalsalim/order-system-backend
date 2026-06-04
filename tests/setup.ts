import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { MenuItem } from '../src/entity/MenuItem';
import { Order } from '../src/entity/Order';

// In-memory SQLite data source for tests
export const TestDataSource = new DataSource({
  type: 'sqlite',
  database: ':memory:',
  synchronize: true,
  logging: false,
  entities: [MenuItem, Order],
});

// Patch AppDataSource before any module uses it
jest.mock('../src/data-source', () => ({
  AppDataSource: TestDataSource,
}));

beforeAll(async () => {
  await TestDataSource.initialize();
});

afterAll(async () => {
  if (TestDataSource.isInitialized) {
    await TestDataSource.destroy();
  }
});

afterEach(async () => {
  // Clear tables between tests
  await TestDataSource.getRepository(Order).delete({});
  await TestDataSource.getRepository(MenuItem).delete({});
});
