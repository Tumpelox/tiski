'use server';

import { BundleDatabase } from '@/interfaces/bundle.interface';
import { Order, OrderDatabase } from '@/interfaces/order.interface';
import {
  Product,
  ProductDatabase,
  ProductDocument,
} from '@/interfaces/product.interface';
import { getAdminDatabases } from '@/services/databases';
import { getOrderCode } from '@/services/orderCode';
import { getLoggedInUser } from '@/services/userSession';
import { ToastType } from '@/store';

import { ID, Permission, Query, Role } from 'node-appwrite';
import { z } from 'zod';

export interface NewOrder {
  products: Product['$id'][];
  bundles: Product['$id'][];
  shippingName: string;
  shippingAddress: string;
  notes: string;
}

const orderSchema = z.object({
  products: z.array(z.string()),
  bundles: z.array(z.string()),
  shippingName: z.string(),
  shippingAddress: z.string(),
  notes: z.string().max(1024).optional(),
});

export const newOrder = async (
  _prevState: { message: string; type: ToastType; data: string | null } | null,
  form: FormData
): Promise<{ message: string; type: ToastType; data: string | null }> => {
  const user = await getLoggedInUser();

  if (!user) {
    return { message: 'Syötä koodi', type: ToastType.ERROR, data: null };
  }

  const orderCode = await getOrderCode(user);

  if (!orderCode) {
    return { message: 'Syötä koodi', type: ToastType.ERROR, data: null };
  }

  const parsedOrder = orderSchema.safeParse({
    products: (form.get('products')?.toString() ?? '').split(','),
    bundles: (form.get('bundles')?.toString() ?? '').split(','),
    shippingName: form.get('shippingName'),
    shippingAddress: form.get('shippingAddress'),
    notes: form.get('notes'),
  });

  if (parsedOrder.success === false) {
    return {
      message: 'Virheellinen pyyntö',
      type: ToastType.ERROR,
      data: null,
    };
  }

  const { products, bundles, shippingAddress, shippingName } = parsedOrder.data;

  if (products.length === 0 && bundles.length === 0) {
    return {
      message: 'Tilauksessa ei ole tuotteita',
      type: ToastType.ERROR,
      data: null,
    };
  }

  try {
    const databases = await getAdminDatabases();

    const productsList = await databases.listDocuments<ProductDocument>(
      ProductDatabase.DatabaseId,
      ProductDatabase.CollectionId,
      [Query.equal('$id', products)]
    );

    console.log('Products List:', productsList);

    const bundlesList = await databases.listDocuments<ProductDocument>(
      BundleDatabase.DatabaseId,
      BundleDatabase.CollectionId,
      [Query.equal('$id', bundles)]
    );

    console.log('Bundles List:', bundlesList);

    if (
      productsList.documents.length === 0 &&
      bundlesList.documents.length === 0
    ) {
      return {
        message: 'Tuotteita ei löytynyt',
        type: ToastType.ERROR,
        data: null,
      };
    }

    const newOrder = await databases.createDocument<Order>(
      OrderDatabase.DatabaseId,
      OrderDatabase.CollectionId,
      ID.custom(orderCode.$id),
      {
        orderCode: orderCode.$id,
        products: productsList.documents.map((product) => product.$id),
        bundles: bundlesList.documents.map((bundle) => bundle.$id),
        contacts: {
          address: shippingAddress,
          name: shippingName,
        },
        notes: null,
        shipped: null,
        canceled: null,
      },
      [Permission.read(Role.user(user.$id))]
    );

    return {
      message: 'Tilauksen luonti onnistui',
      type: ToastType.SUCCESS,
      data: newOrder.$id,
    };
  } catch (error) {
    console.error('Error creating order:', error);
    return {
      message: 'Tilauksen luonti epäonnistui',
      type: ToastType.ERROR,
      data: null,
    };
  }
};
