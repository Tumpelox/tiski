import { Models } from 'node-appwrite';
import { PictureDocument } from './picture.interface';

export enum FeedDatabase {
  DatabaseId = 'nettisivu',
  CollectionId = 'feed',
  ImageCollectionId = 'images',
  BucketId = 'Images',
}

export interface Feed {
  text: string;
  images: PictureDocument[];
}

export interface FeedDocument extends Feed, Models.Document {}
