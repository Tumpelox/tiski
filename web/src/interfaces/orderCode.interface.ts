import { Models } from 'node-appwrite';

export enum OrderCodeDatabase {
  DatabaseId = 'tarratiski',
  CollectionId = 'tilauskoodit',
}

export interface OrderCode extends Models.Document {
  name: string;
  availableOrders: number;
  creator: string;
  code: string;
  userId: string;
}
