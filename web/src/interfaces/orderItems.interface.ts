import { Models } from 'node-appwrite';
import { BundleDocument } from './bundle.interface';
import { ProductDocument } from './product.interface';

export enum OrderItemDatabase {
  DatabaseId = 'tarratiski',
  CollectionId = 'orderItems',
}

export interface OrderItem extends Models.Document {
  product: ProductDocument;
  bundle: BundleDocument;
  quantity: number;
}
