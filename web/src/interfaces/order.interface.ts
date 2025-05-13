import { Models } from 'node-appwrite';
import { Bundle } from './bundle.interface';
import { OrderCode } from './orderCode.interface';
import { Product } from './product.interface';

export enum OrderDatabase {
  DatabaseId = 'tarratiski',
  CollectionId = 'tilaukset',
}

export interface Order extends Models.Document {
  orderCode: OrderCode;
  orderContacts: Contacts;
  orderItems: OrderItem[];
  orderNotes: string | null;
  orderShipped: Date | null;
  orderCanceled: Date | null;
}

export interface Contacts extends Models.Document {
  address: string;
  name: string;
  orders: Order;
}

export interface OrderItem extends Models.Document {
  product?: Product;
  bundle?: Bundle;
  quantity: number;
}
