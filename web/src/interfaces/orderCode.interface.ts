import { Models } from 'node-appwrite';
import { Order } from './order.interface';

export enum OrderCodeDatabase {
  DatabaseId = 'tarratiski',
  CollectionId = 'tilauskoodit',
}

export interface OrderCode extends Models.Document {
  name: string;
  availableOrders: number;
  orders: Order[];
  creator: string;
  code: string;
  userId: string;
  isActive: boolean;
}
