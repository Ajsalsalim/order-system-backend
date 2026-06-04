import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AppDataSource } from './data-source';
import { menuRouter } from './routes/menu';
import { ordersRouter } from './routes/orders';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { seedMenuIfEmpty } from './services/menuService';

dotenv.config();

export const app = express();

app.use(cors({
  origin: 'https://order-system-frontend-theta.vercel.app/', // your Vercel URL
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  credentials: true
}));
app.use(express.json());

app.use('/api/menu', menuRouter);
app.use('/api/orders', ordersRouter);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = parseInt(process.env.PORT || '3001', 10);

// Only start listening when not in test environment
if (process.env.NODE_ENV !== 'test') {
  AppDataSource.initialize()
    .then(async () => {
      await seedMenuIfEmpty();
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch((err: unknown) => {
      console.error('DB connection failed:', err);
      process.exit(1);
    });
}
