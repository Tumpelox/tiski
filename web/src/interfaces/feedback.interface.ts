import { Models } from 'node-appwrite';

export enum FeedbackDatabase {
  DatabaseId = 'nettisivu',
  CollectionId = 'feedback',
}

export interface Feedback extends Models.Document {
  feedbackName: string;
  feedbackMessage: string;
  reCaptchaScore: number;
}
