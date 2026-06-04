import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export type OrderStatus =
  | 'Order Received'
  | 'Preparing'
  | 'Out for Delivery'
  | 'Delivered';

export interface OrderItem {
  menuItemId: number;
  name: string;
  quantity: number;
  price: number;
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  customerName!: string;

  @Column({ type: 'text' })
  address!: string;

  @Column({ type: 'varchar', length: 20 })
  phoneNumber!: string;

  @Column({
    type: 'enum',
    enum: ['Order Received', 'Preparing', 'Out for Delivery', 'Delivered'],
    default: 'Order Received',
  })
  status!: OrderStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ type: 'json' })
  items!: OrderItem[];
}
