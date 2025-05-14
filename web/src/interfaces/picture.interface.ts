import { Models } from 'node-appwrite';

export enum PictureDatabase {
  DatabaseId = 'tarratiski',
  CollectionId = 'pictures',
  BucketId = 'Images',
}

export interface Picture {
  src: string;
  height: number;
  width: number;
  alt: string;
}

export interface PictureDocument extends Picture, Models.Document {}
