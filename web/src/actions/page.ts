'use server';

import { Article, ArticleDatabase } from '@/interfaces/article.interface';
import {
  createDocument,
  getDocumentWithApi,
  updateDocument,
} from '@/services/databases';
import { ToastType } from '@/store';
import { z } from 'zod';

const slugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const titleSchema = z.string().min(1).max(128);
const textSchema = z.string().max(2048);

const savePage = async (
  _prevState: { message: string; type: ToastType } | null | undefined,
  form: FormData
) => {
  const slug = slugSchema.safeParse(form.get('slug'));
  const title = titleSchema.safeParse(form.get('title'));
  const text = textSchema.safeParse(form.get('text'));

  console.log(slug.success, title.success, text.success);
  if (!slug.success || !title.success || !text.success) {
    let errorMessage = 'Sivua ei voitu tallentaa. Tarkista kentät:';
    if (!slug.success) errorMessage += ' Slug';
    if (!title.success) errorMessage += ' Otsikko';
    if (!text.success) errorMessage += ' Teksti';
    return { message: errorMessage, type: ToastType.ERROR };
  }

  try {
    await updateDocument<Article>(
      ArticleDatabase.DatabaseId,
      ArticleDatabase.CollectionId,
      slug.data,
      {
        title: title.data,
        text: text.data,
      }
    );

    return {
      message: 'Sivu tallennettu onnistuneesti',
      type: ToastType.SUCCESS,
    };
  } catch (error) {
    console.error('Error saving page:', error);
    return { message: 'Sivua ei voitu tallentaa', type: ToastType.ERROR };
  }
};

export default savePage;

export const createPage = async (
  _prevState:
    | { message: string; type: ToastType; data: string | null }
    | null
    | undefined,
  form: FormData
) => {
  const slug = slugSchema.safeParse(form.get('slug'));
  const title = titleSchema.safeParse(form.get('title'));
  const text = textSchema.safeParse(form.get('text'));

  if (!slug.success || !title.success || !text.success) {
    let errorMessage = 'Sivua ei voitu luoda. Tarkista kentät:';
    if (!slug.success) errorMessage += ' Slug';
    if (!title.success) errorMessage += ' Otsikko';
    if (!text.success) errorMessage += ' Teksti';
    return { message: errorMessage, type: ToastType.ERROR, data: null };
  }

  try {
    const { data } = await getDocumentWithApi<Article>(
      ArticleDatabase.DatabaseId,
      ArticleDatabase.CollectionId,
      slug.data
    );

    if (data) {
      return {
        message: 'Sivu on jo olemassa',
        type: ToastType.ERROR,
        data: slug.data,
      };
    }

    await createDocument<Article>(
      ArticleDatabase.DatabaseId,
      ArticleDatabase.CollectionId,
      slug.data, // Use provided slug as document ID
      {
        title: title.data,
        text: text.data,
      }
    );

    return {
      message: 'Sivu luotu onnistuneesti',
      type: ToastType.SUCCESS,
      data: slug.data,
    };
  } catch (error) {
    console.error('Error creating page:', error);
    return {
      message: 'Sivua ei voitu luoda palvelinvirheen vuoksi',
      type: ToastType.ERROR,
      data: null,
    };
  }
};
