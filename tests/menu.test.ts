import './setup';
import request from 'supertest';
import { app } from '../src/index';
import { TestDataSource } from './setup';
import { MenuItem } from '../src/entity/MenuItem';

const seedItem = async () => {
  const repo = TestDataSource.getRepository(MenuItem);
  return repo.save(
    repo.create({
      name: 'Test Pizza',
      description: 'A test pizza',
      price: 9.99,
      imageUrl: 'https://placehold.co/300x200',
    })
  );
};

describe('GET /api/menu', () => {
  it('returns an empty array when no items exist', async () => {
    const res = await request(app).get('/api/menu');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data).toHaveLength(0);
  });

  it('returns array of menu items', async () => {
    await seedItem();
    const res = await request(app).get('/api/menu');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].name).toBe('Test Pizza');
  });
});
