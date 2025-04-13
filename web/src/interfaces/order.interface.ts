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
  products: Product[];
  bundles: Bundle[];
  shippingName: string;
  shippingAddress: string;
  notes: string | null;
  shipped: Date | null;
  canceled: Date | null;
}
