import { Models } from 'node-appwrite';
import { Product, ProductDocument } from './product.interface';

export enum BundleDatabase {
  DatabaseId = 'tarratiski',
  CollectionId = 'tuotepaketit',
}

export interface Bundle {
  $id: string;
  title: string;
  description: string;
  products: Product[];
  available: boolean;
}

export interface BundleDocument extends Models.Document, Bundle {
  products: ProductDocument[];
}
