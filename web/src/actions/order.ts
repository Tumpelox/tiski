'use server';

import { BundleDatabase } from '@/interfaces/bundle.interface';
import { Order, OrderDatabase } from '@/interfaces/order.interface';
import {
  ProductDatabase,
  ProductDocument,
} from '@/interfaces/product.interface';
import orderSchema from '@/schemas/order.schema';
import { getAdminDatabases, listDocumentsWithApi } from '@/services/databases';
import { getOrderCode } from '@/services/orderCode';
import { getLoggedInUser } from '@/services/userSession';
import { ToastType } from '@/store';

import { ID, Permission, Query, Role } from 'node-appwrite';
import { z } from 'zod';

export const newOrder = async (
  data: z.infer<typeof orderSchema>
): Promise<{ message: string; type: ToastType; data: string | null }> => {
  const user = await getLoggedInUser();

  if (!user) {
    return { message: 'Syötä koodi', type: ToastType.ERROR, data: null };
  }

  const orderCode = await getOrderCode(user);

  if (!orderCode) {
    return { message: 'Syötä koodi', type: ToastType.ERROR, data: null };
  }

  const parsedOrder = orderSchema.safeParse(data);

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

    const productsList =
      products.length > 0
        ? ((
            await listDocumentsWithApi<ProductDocument>(
              ProductDatabase.DatabaseId,
              ProductDatabase.CollectionId,
              [Query.equal('$id', products)]
            )
          ).data ?? [])
        : [];

    const bundlesList =
      bundles.length > 0
        ? ((
            await listDocumentsWithApi<ProductDocument>(
              BundleDatabase.DatabaseId,
              BundleDatabase.CollectionId,
              [Query.equal('$id', bundles)]
            )
          ).data ?? [])
        : [];

    if (productsList.length === 0 && bundlesList.length === 0) {
      return {
        message: 'Tuotteita ei löytynyt',
        type: ToastType.ERROR,
        data: null,
      };
    }

    if (productsList.length + bundlesList.length > orderCode.availableOrders) {
      return {
        message: 'Tilauksessa on liikaa tuotteita',
        type: ToastType.ERROR,
        data: null,
      };
    }

    const newOrder = await databases.createDocument<Order>(
      OrderDatabase.DatabaseId,
      OrderDatabase.CollectionId,
      ID.custom(orderCode.code),
      {
        orderCode: orderCode.$id,
        products: productsList.map((product) => product.$id),
        bundles: bundlesList.map((bundle) => bundle.$id),
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
