import './setup';
import request from 'supertest';
import { app } from '../src/index';
import { TestDataSource } from './setup';
import { Order } from '../src/entity/Order';

const validPayload = {
  customerName: 'Jane Doe',
  address: '123 Main Street',
  phoneNumber: '5551234567',
  items: [
    { menuItemId: 1, name: 'Pizza', quantity: 2, price: 9.99 },
  ],
};

const seedOrder = async () => {
  const repo = TestDataSource.getRepository(Order);
  return repo.save(
    repo.create({
      customerName: 'John Smith',
      address: '456 Oak Avenue',
      phoneNumber: '5559876543',
      status: 'Order Received',
      totalAmount: 19.98,
      items: [{ menuItemId: 1, name: 'Burger', quantity: 2, price: 9.99 }],
    })
  );
};

describe('POST /api/orders', () => {
  it('creates an order with valid payload', async () => {
    const res = await request(app).post('/api/orders').send(validPayload);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.customerName).toBe('Jane Doe');
    expect(res.body.data.status).toBe('Order Received');
    expect(parseFloat(res.body.data.totalAmount)).toBeCloseTo(19.98, 1);
  });

  it('returns 400 when customerName is missing', async () => {
    const { customerName: _, ...body } = validPayload;
    const res = await request(app).post('/api/orders').send(body);
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toBeDefined();
  });

  it('returns 400 when address is too short', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({ ...validPayload, address: 'Hi' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('returns 400 when items array is empty', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({ ...validPayload, items: [] });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('returns 400 when phoneNumber format is invalid', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({ ...validPayload, phoneNumber: '123' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe('GET /api/orders/:id', () => {
  it('returns the correct order', async () => {
    const order = await seedOrder();
    const res = await request(app).get(`/api/orders/${order.id}`);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(order.id);
    expect(res.body.data.customerName).toBe('John Smith');
  });

  it('returns 404 for non-existent order', async () => {
    const res = await request(app).get('/api/orders/99999');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

describe('PATCH /api/orders/:id/status', () => {
  it('updates status correctly', async () => {
    const order = await seedOrder();
    const res = await request(app)
      .patch(`/api/orders/${order.id}/status`)
      .send({ status: 'Preparing' });
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('Preparing');
  });

  it('rejects invalid status value', async () => {
    const order = await seedOrder();
    const res = await request(app)
      .patch(`/api/orders/${order.id}/status`)
      .send({ status: 'Flying' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
