import { AppDataSource } from '../data-source';
import { MenuItem } from '../entity/MenuItem';

const repo = () => AppDataSource.getRepository(MenuItem);

export async function getAllMenuItems(): Promise<MenuItem[]> {
  return repo().find();
}

export async function createMenuItem(
  data: Omit<MenuItem, 'id'>
): Promise<MenuItem> {
  const item = repo().create(data);
  return repo().save(item);
}

export async function seedMenuIfEmpty(): Promise<void> {
  const count = await repo().count();
  if (count > 0) return;

  const items: Omit<MenuItem, 'id'>[] = [
    {
      name: 'Margherita Pizza',
      description: 'Classic tomato sauce, mozzarella, and fresh basil on a crispy crust.',
      price: 12.99,
      imageUrl: 'https://placehold.co/300x200?text=Pizza',
    },
    {
      name: 'Cheeseburger',
      description: 'Juicy beef patty with cheddar, lettuce, tomato, and special sauce.',
      price: 9.99,
      imageUrl: 'https://placehold.co/300x200?text=Burger',
    },
    {
      name: 'Spaghetti Carbonara',
      description: 'Creamy pasta with pancetta, egg, parmesan, and black pepper.',
      price: 13.49,
      imageUrl: 'https://placehold.co/300x200?text=Pasta',
    },
    {
      name: 'Caesar Salad',
      description: 'Crisp romaine, croutons, parmesan, and classic Caesar dressing.',
      price: 8.99,
      imageUrl: 'https://placehold.co/300x200?text=Salad',
    },
    {
      name: 'Loaded Fries',
      description: 'Golden fries topped with cheese sauce, bacon bits, and sour cream.',
      price: 6.49,
      imageUrl: 'https://placehold.co/300x200?text=Fries',
    },
    {
      name: 'Soda',
      description: 'Chilled can of your choice: Coke, Sprite, or Fanta.',
      price: 2.49,
      imageUrl: 'https://placehold.co/300x200?text=Soda',
    },
  ];

  await repo().save(items.map((i) => repo().create(i)));
}
