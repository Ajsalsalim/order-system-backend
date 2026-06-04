import { Request, Response } from 'express';
import { getAllMenuItems, createMenuItem } from '../services/menuService';

export async function getMenu(_req: Request, res: Response): Promise<void> {
  const items = await getAllMenuItems();
  res.json({ success: true, data: items });
}

export async function addMenuItem(req: Request, res: Response): Promise<void> {
  const item = await createMenuItem(req.body);
  res.status(201).json({ success: true, data: item });
}
