import { Models } from 'node-appwrite';
import { Product, ProductDocument } from './product.interface';
import { Picture } from './picture.interface';

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
  hidden: boolean;
  promoImage: Picture | null;
}

export interface BundleDocument extends Models.Document, Bundle {
  products: ProductDocument[];
}
