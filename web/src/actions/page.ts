'use server';

import { ArticleDatabase } from '@/interfaces/article.interface';
import { getAdminDatabases } from '@/services/databases';
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
    return { message: 'Sivua ei voitu tallentaa', type: ToastType.ERROR };
  }

  try {
    const database = await getAdminDatabases();

    await database.updateDocument(
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
