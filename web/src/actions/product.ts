'use server';

import { Query } from 'node-appwrite';
import { getAdminDatabases } from '@/services/databases'; //
import {
  Product,
  ProductDatabase,
  ProductDocument,
} from '@/interfaces/product.interface';
import { clientSideProduct } from '@/lib/clientSideProduct';

// Geminin settiä mut vois olla järkevämpää vaa käyttää tRPC:tä tuotteiden hakuun. Server actionit ei oo tarkotettu varsinaisesti tähän

/**
 * Fetches the current stock and availability for a list of product IDs.
 * @param productIds - An array of product IDs to check.
 * @returns A promise that resolves to an array of ProductAvailability objects.
 */
export const fetchProducts = async (
  productIds: string[]
): Promise<Product[]> => {
  if (!productIds || productIds.length === 0) {
    return [];
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
    console.error('Error fetching product availability:', error);
    // Depending on your error handling strategy, you might throw the error
    // or return an empty array or a specific error indicator.
    throw new Error('Failed to fetch product availability.');
  }
};
