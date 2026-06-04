import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate';
import {
  placeOrder,
  getOrder,
  listOrders,
  patchOrderStatus,
  orderStatusStream,
} from '../controllers/orderController';
import { asyncHandler } from '../middleware/errorHandler';

export const ordersRouter = Router();

const orderItemSchema = z.object({
  menuItemId: z.coerce.number({ required_error: 'menuItemId is required' }).int().positive(),
  name: z.string().min(1, 'Item name is required'),
  quantity: z.coerce.number().int().min(1, 'Quantity must be at least 1'),
  price: z.coerce.number().positive('Price must be positive'),
});

const createOrderSchema = z.object({
  customerName: z.string().min(2, 'customerName must be at least 2 characters'),
  address: z.string().min(5, 'address must be at least 5 characters'),
  phoneNumber: z
    .string()
    .regex(/^\d{10}$/, 'phoneNumber must be a valid 10-digit number'),
  items: z
    .array(orderItemSchema)
    .min(1, 'items must be a non-empty array'),
});

ordersRouter.post('/', validate(createOrderSchema), asyncHandler(placeOrder));
ordersRouter.get('/', asyncHandler(listOrders));
ordersRouter.get('/:id', asyncHandler(getOrder));
ordersRouter.patch('/:id/status', asyncHandler(patchOrderStatus));
ordersRouter.get('/:id/status-stream', orderStatusStream);
