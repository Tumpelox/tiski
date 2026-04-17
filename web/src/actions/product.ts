'use server';

import { ID, Query } from 'node-appwrite';
import {
  createDocument,
  DatabaseErrors,
  getAdminDatabases,
  getDocument,
  removeDocument,
  updateDocument,
} from '@/services/databases'; //
import {
  Product,
  ProductDatabase,
  ProductDocument,
} from '@/interfaces/product.interface';
import { clientSideProduct } from '@/lib/clientSideProduct';
import { z } from 'zod';
import { ToastType } from '@/store';
import createFile, { formatID, getFile, removeFile } from '@/services/storage';
import imageSize from 'image-size';
import { Picture } from '@/interfaces/picture.interface';
import imageSchema from '@/schemas/image.schema';
import { getLoggedInUser } from '@/services/userSession';
import isAdmin from '@/lib/isAdmin';
import { ErrorResponse } from '@/services/appwrite';
import productSchema from '@/schemas/product.schema';
import { title } from 'process';

// Geminin settiä mut vois olla järkevämpää vaa käyttää tRPC:tä tuotteiden hakuun. Server actionit ei oo tarkotettu varsinaisesti tähän

const productIdSchema = z.string().min(1).max(32);

/**
 * Fetches the current stock and availability for a list of product IDs.
 * @param productIds - An array of product IDs to check.
 * @returns A promise that resolves to an array of ProductAvailability objects.
 */
export const fetchProducts = async (
  productIds: string[]
): Promise<{ data: Product[] | null; message: string; type: ToastType }> => {
  const parsedProductIds = productIdSchema.array().safeParse(productIds);

  if (
    parsedProductIds.success === false ||
    parsedProductIds.data.length === 0
  ) {
    return {
      data: null,
      message: 'Virheellinen pyyntö',
      type: ToastType.ERROR,
    };
  }

  try {
    const databases = await getAdminDatabases(); //

    const response = await databases.listDocuments<ProductDocument>(
      ProductDatabase.DatabaseId,
      ProductDatabase.CollectionId,
      [Query.equal('$id', productIds), Query.limit(productIds.length)]
    );

    // Map the results to the simplified ProductAvailability interface
    const availabilityData = response.documents.map((doc) =>
      clientSideProduct(doc)
    );

    return { data: availabilityData, message: '', type: ToastType.SUCCESS };
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      data: null,
      message: 'Tuotteiden hakeminen epäonnistui',
      type: ToastType.ERROR,
    };
  }
};

const uploadImages = async (images: z.infer<typeof imageSchema>[]) => {
  const uploadedImages: (Picture & { $id: string })[] = [];

  for (const image of images) {
    try {
      const file = await createFile(
        ProductDatabase.BucketId,
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

export const uploadProduct = async (upload: z.infer<typeof productSchema>) => {
  const { user } = await getLoggedInUser();

  if (!user || !isAdmin(user)) {
    return {
      message: 'Sinulla ei ole riittäviä käyttöoikeuksia',
      type: ToastType.ERROR,
      data: null,
    };
  }

  const { data, success } = productSchema.safeParse(upload);

  if (success === false) {
    return {
      message: 'Virheellinen pyyntö',
      type: ToastType.ERROR,
      data: null,
    };
  }

  const uploadedImages = await uploadImages(data.pictures || []);

  const result = await createDocument<ProductDocument>(
    ProductDatabase.DatabaseId,
    ProductDatabase.CollectionId,
    ID.unique(),
    {
      title: data.title,
      description: data.description,
      stock: Number(data.stock),
      available: data.available,
      hidden: data.hidden,
      pictures: uploadedImages,
    }
  );

  if (!result) {
    return {
      message: 'Tuotteen luominen epäonnistui',
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

export const updateProduct = async (upload: z.infer<typeof productSchema>) => {
  const { user } = await getLoggedInUser();

  if (!user || !isAdmin(user)) {
    return {
      message: 'Sinulla ei ole riittäviä käyttöoikeuksia',
      type: ToastType.ERROR,
      data: null,
    };
  }

  const { data, success } = productSchema.safeParse(upload);

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
    const product = await getDocument<ProductDocument>(
      ProductDatabase.DatabaseId,
      ProductDatabase.CollectionId,
      data.id
    );

    if (product.error === DatabaseErrors.NotFound)
      return {
        message: 'Tuotetta ei löytynyt',
        type: ToastType.ERROR,
        data: null,
      };

    const removedImageIds =
      product.data?.pictures
        .filter((image) => !data.existingImages!.includes(image.$id))
        .map((image) => image.$id) || [];

    for (const image of removedImageIds) {
      const { error } = await removeImage(image);
    }

    const uploadedImages = await uploadImages(data.pictures || []);

    await updateDocument<ProductDocument>(
      ProductDatabase.DatabaseId,
      ProductDatabase.CollectionId,
      data.id!,
      {
        title: data.title,
        description: data.description,
        stock: data.stock,
        available: data.available,
        hidden: data.hidden,
        pictures: [...data.existingImages, ...uploadedImages],
      }
    );

    return {
      message: 'Sivu tallennettu onnistuneesti',
      type: ToastType.SUCCESS,
    };
  } catch (error) {
    console.error('Error saving page:', error);
    return { message: 'Tuotetta ei voitu tallentaa', type: ToastType.ERROR };
  }
};

export const removeImage = async (id: string) => {
  try {
    const response = await removeFile(ProductDatabase.BucketId, id);

    return response;
  } catch (e) {
    console.error('Error removing image:', e);
    return {
      data: null,
      error: ErrorResponse.Unknown,
    };
  }
};

export const removeProduct = async (id: string) => {
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

  const product = await getDocument<ProductDocument>(
    ProductDatabase.DatabaseId,
    ProductDatabase.CollectionId,
    id
  );

  if (product.error === DatabaseErrors.NotFound)
    return {
      message: 'Julkaisua ei löytynyt',
      type: ToastType.ERROR,
      data: null,
    };

  for (const image of product.data?.pictures || []) {
    const { error } = await removeImage(image.$id);
  }

  const documentResult = await removeDocument(
    ProductDatabase.DatabaseId,
    ProductDatabase.CollectionId,
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
