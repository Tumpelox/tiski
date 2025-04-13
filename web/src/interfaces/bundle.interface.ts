import { Product } from './product.interface';

export enum BundleDatabase {
  DatabaseId = 'tarratiski',
  CollectionId = 'tuotepaketit',
}

export interface Bundle {
  title: string;
  description: string;
  products: Product[];
}
