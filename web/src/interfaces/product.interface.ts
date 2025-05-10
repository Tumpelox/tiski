import { Models } from 'node-appwrite';
import { Picture } from './picture.interface';

export enum ProductDatabase {
  DatabaseId = 'tarratiski',
  CollectionId = 'tuotteet',
}

export interface Product {
  title: string;
  description: string;
  stock: number;
  pictures: Picture[];
  available: boolean;
  hidden: boolean;
  $id: string;
}

export interface ProductDocument extends Models.Document, Product {}

export const exampleProduct: ProductDocument = {
  $id: '1',
  $collection: '',
  $permissions: [],
  $databaseId: '',
  $collectionId: '',
  $createdAt: '',
  $updatedAt: '',
  title: 'Tuote',
  description: 'Tuotteen kuvaus',
  stock: 10,
  hidden: false,
  pictures: [
    {
      url: 'https://res.cloudinary.com/lieka/images/f_webp,q_auto/v1713953440/Tarrat-tarrapaketti-kettu-tarra-noniin-saatana-01/Tarrat-tarrapaketti-kettu-tarra-noniin-saatana-01.webp',
      height: 1500,
      width: 1500,
      alt: 'Tuotteen kuva',
    },
    {
      url: 'https://www.wandamotor.com/images/products_webp/ykan_pelatin_tarra_CS-21-1130-2.webp',
      height: 1024,
      width: 1024,
      alt: 'Tuotteen kuva',
    },
    {
      url: 'https://res.cloudinary.com/lieka/images/f_webp,q_auto/v1714040544/Tarrat-tarrapaketti-tarra-elain-ei-helevata-01/Tarrat-tarrapaketti-tarra-elain-ei-helevata-01.webp',
      height: 1500,
      width: 1500,
      alt: 'Tuotteen kuva',
    },
  ],
  available: true,
};
