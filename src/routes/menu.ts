import { Router } from 'express';
import { getMenu, addMenuItem } from '../controllers/menuController';
import { asyncHandler } from '../middleware/errorHandler';

export const menuRouter = Router();

menuRouter.get('/', asyncHandler(getMenu));
menuRouter.post('/', asyncHandler(addMenuItem));
