'use server';

import {
  PictureDatabase,
  PictureDocument,
} from '@/interfaces/picture.interface';
import imageSchema from '@/schemas/image.schema';
import { createDocument, removeDocument } from '@/services/databases';
import createFile, { formatID, getFile, removeFile } from '@/services/storage';
import { imageSize } from 'image-size';
import { ToastType } from '@/store';

import { z } from 'zod';
import { ErrorResponse } from '@/services/appwrite';
import { getLoggedInUser } from '@/services/userSession';
import isAdmin from '@/lib/isAdmin';

export const uploadImage = async (upload: z.infer<typeof imageSchema>) => {
  const { user } = await getLoggedInUser();

  if (!user || !isAdmin(user)) {
    return {
      message: 'Sinulla ei ole riittäviä käyttöoikeuksia',
      type: ToastType.ERROR,
      data: null,
    };
  }

  const { data, success } = imageSchema.safeParse(upload);

  if (success === false) {
    return {
      message: 'Virheellinen pyyntö',
      type: ToastType.ERROR,
      data: null,
    };
  }

  const file = await createFile(
    PictureDatabase.BucketId,
    formatID(data.file),
    data.file.data
  );

  if (!file.data) {
    return {
      message: 'Kuvan lähetys epäonnistui',
      type: ToastType.ERROR,
      data: null,
    };
  }
  const { width = 0, height = 0 } = imageSize(
    Buffer.from(await data.file.data.arrayBuffer())
  );

  const { src } = getFile(file.data);

  const result = await createDocument<PictureDocument>(
    PictureDatabase.DatabaseId,
    PictureDatabase.CollectionId,
    file.data.$id,
    {
      src,
      width,
      height,
      alt: data.alt,
    }
  );

  if (!result) {
    return {
      message: 'Kuvan lähetys epäonnistui',
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

export const removeImage = async (id: string) => {
  const { user } = await getLoggedInUser();

  if (!user || !isAdmin(user)) {
    return {
      message: 'Sinulla ei ole riittäviä käyttöoikeuksia',
      type: ToastType.ERROR,
      data: null,
    };
  }

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

  const { error } = await removeFile(PictureDatabase.BucketId, data);

  if (error) {
    if (error === ErrorResponse.Unauthorized)
      return {
        message: 'Ei oikeuksia',
        type: ToastType.ERROR,
        data: null,
      };
    else if (error === ErrorResponse.NotFound)
      return {
        message: 'Kuvaa ei löytynyt',
        type: ToastType.ERROR,
        data: null,
      };
    else
      return {
        message: 'Kuvan poisto epäonnistui',
        type: ToastType.ERROR,
        data: null,
      };
  }

  const documentResult = await removeDocument(
    PictureDatabase.DatabaseId,
    PictureDatabase.CollectionId,
    id
  );

  if (documentResult.error)
    return {
      message: 'Kuvan poisto epäonnistui',
      type: ToastType.ERROR,
      data: null,
    };

  return {
    message: 'Kuva poistettu onnistuneesti',
    type: ToastType.SUCCESS,
    data: null,
  };
};
