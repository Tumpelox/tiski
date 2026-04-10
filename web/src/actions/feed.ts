'use server';

import {
  createDocument,
  DatabaseErrors,
  getDocument,
  removeDocument,
  updateDocument,
} from '@/services/databases';
import createFile, { formatID, getFile, removeFile } from '@/services/storage';
import { imageSize } from 'image-size';
import { ToastType } from '@/store';
import { z } from 'zod';
import { ErrorResponse } from '@/services/appwrite';
import { FeedDatabase, FeedDocument } from '@/interfaces/feed.interface';
import feedSchema from '@/schemas/feed.schema';
import { Picture } from '@/interfaces/picture.interface';
import { ID } from 'node-appwrite';
import imageSchema from '@/schemas/image.schema';
import { getLoggedInUser } from '@/services/userSession';
import isAdmin from '@/lib/isAdmin';

const uploadImages = async (images: z.infer<typeof imageSchema>[]) => {
  const uploadedImages: (Picture & { $id: string })[] = [];

  for (const image of images) {
    try {
      const file = await createFile(
        FeedDatabase.BucketId,
        formatID(image.file),
        image.file.data
      );

      if (!file.data) throw new Error('File upload failed');

      const { width = 0, height = 0 } = imageSize(
        Buffer.from(await image.file.data.arrayBuffer())
      );

      const { src } = getFile(file.data);

      uploadedImages.push({
        $id: file.data.$id,
        src: src.href,
        width,
        height,
        alt: image.alt,
      });
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  }

  return uploadedImages;
};

export const uploadFeed = async (upload: z.infer<typeof feedSchema>) => {
  const { user } = await getLoggedInUser();

  if (!user || !isAdmin(user)) {
    return {
      message: 'Sinulla ei ole riittäviä käyttöoikeuksia',
      type: ToastType.ERROR,
      data: null,
    };
  }

  const { data, success } = feedSchema.safeParse(upload);

  if (success === false) {
    return {
      message: 'Virheellinen pyyntö',
      type: ToastType.ERROR,
      data: null,
    };
  }

  const uploadedImages = await uploadImages(data.images || []);

  const result = await createDocument<FeedDocument>(
    FeedDatabase.DatabaseId,
    FeedDatabase.CollectionId,
    ID.unique(),
    {
      text: data.text,
      images: uploadedImages,
    }
  );

  if (!result) {
    return {
      message: 'Julkaisun luominen epäonnistui',
      type: ToastType.ERROR,
      data: null,
    };
  }

  return {
    message: 'Kuva lähetetty onnistuneesti',
    type: ToastType.SUCCESS,
    data: result.data,
  };
};

export const updateFeed = async (upload: z.infer<typeof feedSchema>) => {
  const { user } = await getLoggedInUser();

  if (!user || !isAdmin(user)) {
    return {
      message: 'Sinulla ei ole riittäviä käyttöoikeuksia',
      type: ToastType.ERROR,
      data: null,
    };
  }

  const { data, success } = feedSchema.safeParse(upload);

  if (
    success === false ||
    data?.id === undefined ||
    data?.existingImages === undefined
  ) {
    return {
      message: 'Virheellinen pyyntö',
      type: ToastType.ERROR,
      data: null,
    };
  }

  try {
    const feed = await getDocument<FeedDocument>(
      FeedDatabase.DatabaseId,
      FeedDatabase.CollectionId,
      data.id
    );

    if (feed.error === DatabaseErrors.NotFound)
      return {
        message: 'Julkaisua ei löytynyt',
        type: ToastType.ERROR,
        data: null,
      };

    const removedImageIds =
      feed.data?.images
        .filter((image) => !data.existingImages!.includes(image.$id))
        .map((image) => image.$id) || [];

    for (const image of removedImageIds) {
      const { error } = await removeImage(image);
    }

    const uploadedImages = await uploadImages(data.images || []);

    await updateDocument<FeedDocument>(
      FeedDatabase.DatabaseId,
      FeedDatabase.CollectionId,
      data.id!,
      {
        text: data.text,
        images: [...data.existingImages, ...uploadedImages],
      }
    );

    return {
      message: 'Sivu tallennettu onnistuneesti',
      type: ToastType.SUCCESS,
    };
  } catch (error) {
    console.error('Error saving page:', error);
    return { message: 'Julkaisua ei voitu tallentaa', type: ToastType.ERROR };
  }
};

export const removeImage = async (id: string) => {
  try {
    const response = await removeFile(FeedDatabase.BucketId, id);

    return response;
  } catch (e) {
    console.error('Error removing image:', e);
    return {
      data: null,
      error: ErrorResponse.Unknown,
    };
  }
};

export const removeFeed = async (id: string) => {
  const { data, success } = z
    .string()
    .regex(/^[a-zA-Z0-9_.-]*$/)
    .safeParse(id);

  if (success === false) {
    return {
      message: 'Virheellinen pyyntö',
      type: ToastType.ERROR,
      data: null,
    };
  }

  const feed = await getDocument<FeedDocument>(
    FeedDatabase.DatabaseId,
    FeedDatabase.CollectionId,
    id
  );

  if (feed.error === DatabaseErrors.NotFound)
    return {
      message: 'Julkaisua ei löytynyt',
      type: ToastType.ERROR,
      data: null,
    };

  for (const image of feed.data?.images || []) {
    const { error } = await removeImage(image.$id);
  }

  const documentResult = await removeDocument(
    FeedDatabase.DatabaseId,
    FeedDatabase.CollectionId,
    id
  );

  if (documentResult.error)
    return {
      message: 'Julkaisun poisto epäonnistui',
      type: ToastType.ERROR,
      data: null,
    };

  return {
    message: 'Julkaisu poistettu onnistuneesti',
    type: ToastType.SUCCESS,
    data: null,
  };
};
