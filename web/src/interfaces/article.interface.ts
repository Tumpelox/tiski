import { Models } from 'node-appwrite';

export enum ArticleDatabase {
  DatabaseId = 'nettisivu',
  CollectionId = 'sivut',
}

export interface InternationalText extends Models.Document {
  language: string;
  text: string;
  page: Article;
}

export interface Article extends Models.Document {
  internationalText: InternationalText[];
  text: string;
}
