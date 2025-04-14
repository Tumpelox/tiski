'use server';

import { Query } from 'node-appwrite';
import { getAdminDatabases } from '@/services/databases'; //
import {
  Product,
  ProductDatabase,
  ProductDocument,
} from '@/interfaces/product.interface';
import { clientSideProduct } from '@/lib/clientSideProduct';
import { z } from 'zod';
import { ToastType } from '@/store';

// Geminin settiä mut vois olla järkevämpää vaa käyttää tRPC:tä tuotteiden hakuun. Server actionit ei oo tarkotettu varsinaisesti tähän

const productIdSchema = z.string().min(1).max(32);

/**
 * Fetches the current stock and availability for a list of product IDs.
 * @param productIds - An array of product IDs to check.
 * @returns A promise that resolves to an array of ProductAvailability objects.
 */
export const fetchProducts = async (
  productIds: string[]
): Promise<Product[] | { message: string; type: ToastType }> => {
  const parsedProductIds = productIdSchema.array().safeParse(productIds);

  if (
    parsedProductIds.success === false ||
    parsedProductIds.data.length === 0
  ) {
    return { message: 'Virheellinen pyyntö', type: ToastType.ERROR };
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

    return availabilityData;
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      message: 'Tuotteiden hakeminen epäonnistui',
      type: ToastType.ERROR,
    };
  }
};
