import { Models } from 'node-appwrite';
import { Article } from './article.interface';

export enum SettingsDatabase {
  DatabaseId = 'nettisivu',
  CollectionId = 'asetukset',
}
export interface Settings extends Models.Document {
  frontpage: Article;
  mainMenu: Menu;
}

export interface Menu extends Models.Document {
  name: string;
  menuItems: MenuItem[];
}

export interface MenuItem extends Models.Document {
  name: string;
  url: string;
}
