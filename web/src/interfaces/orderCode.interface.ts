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

export enum CanAddToCart {
  AlreadyOrdedered = 'Tilaus on jo tehty',
  CodeNotFound = 'Kirjaudu sisään koodilla tehdäksesi tilauksen',
  Ok = 'Ok',
}
