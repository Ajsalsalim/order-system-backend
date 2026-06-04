import { Request, Response } from 'express';
import {
  createOrder,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  VALID_STATUSES,
} from '../services/orderService';
import { OrderStatus } from '../entity/Order';

export async function placeOrder(req: Request, res: Response): Promise<void> {
  const order = await createOrder(req.body);
  res.status(201).json({ success: true, data: order });
}

export async function getOrder(req: Request, res: Response): Promise<void> {
  const id = parseInt(req.params.id, 10);
  const order = await getOrderById(id);
  if (!order) {
    res.status(404).json({ success: false, message: 'Order not found' });
    return;
  }
  res.json({ success: true, data: order });
}

export async function listOrders(_req: Request, res: Response): Promise<void> {
  const orders = await getAllOrders();
  res.json({ success: true, data: orders });
}

export async function patchOrderStatus(req: Request, res: Response): Promise<void> {
  const id = parseInt(req.params.id, 10);
  const { status } = req.body as { status: OrderStatus };

  if (!VALID_STATUSES.includes(status)) {
    res.status(400).json({
      success: false,
      message: 'Invalid status value',
      errors: [{ field: 'status', message: `Must be one of: ${VALID_STATUSES.join(', ')}` }],
    });
    return;
  }

  const order = await updateOrderStatus(id, status);
  if (!order) {
    res.status(404).json({ success: false, message: 'Order not found' });
    return;
  }
  res.json({ success: true, data: order });
}

// SSE endpoint — pushes automatic status progression
export async function orderStatusStream(req: Request, res: Response): Promise<void> {
  const id = parseInt(req.params.id, 10);
  const order = await getOrderById(id);

  if (!order) {
    res.status(404).json({ success: false, message: 'Order not found' });
    return;
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const sendStatus = (status: OrderStatus) => {
    res.write(`data: ${JSON.stringify({ status })}\n\n`);
  };

  // Send current status immediately
  sendStatus(order.status);

  const progression: { status: OrderStatus; delay: number }[] = [
    { status: 'Preparing', delay: 5000 },
    { status: 'Out for Delivery', delay: 10000 },
    { status: 'Delivered', delay: 20000 },
  ];

  const timers: NodeJS.Timeout[] = [];

  for (const step of progression) {
    const t = setTimeout(async () => {
      await updateOrderStatus(id, step.status);
      sendStatus(step.status);
      if (step.status === 'Delivered') {
        res.end();
      }
    }, step.delay);
    timers.push(t);
  }

  req.on('close', () => {
    timers.forEach(clearTimeout);
    res.end();
  });
}
