import { AppDataSource } from '../data-source';
import { Order, OrderItem, OrderStatus } from '../entity/Order';

const repo = () => AppDataSource.getRepository(Order);

export const VALID_STATUSES: OrderStatus[] = [
  'Order Received',
  'Preparing',
  'Out for Delivery',
  'Delivered',
];

export interface CreateOrderInput {
  customerName: string;
  address: string;
  phoneNumber: string;
  items: OrderItem[];
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const totalAmount = input.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const order = repo().create({
    ...input,
    totalAmount: Math.round(totalAmount * 100) / 100,
    status: 'Order Received',
  });
  return repo().save(order);
}

export async function getOrderById(id: number): Promise<Order | null> {
  return repo().findOneBy({ id });
}

export async function getAllOrders(): Promise<Order[]> {
  return repo().find({ order: { createdAt: 'DESC' } });
}

export async function updateOrderStatus(
  id: number,
  status: OrderStatus
): Promise<Order | null> {
  const order = await repo().findOneBy({ id });
  if (!order) return null;
  order.status = status;
  return repo().save(order);
}
