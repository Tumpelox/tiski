import { Models } from 'node-appwrite';

export enum QRCodeDatabase {
  DatabaseId = 'nettisivu',
  CollectionId = 'qrCodes',
}

export interface QRCode extends Models.Document {
  destination: string;
  name: string;
}
