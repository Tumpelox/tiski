'use server';

import { BundleDatabase } from '@/interfaces/bundle.interface';
import { Order, OrderDatabase } from '@/interfaces/order.interface';
import { OrderCodeDatabase } from '@/interfaces/orderCode.interface';
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

  const { products, shippingAddress, shippingName, orderNotes } =
    parsedOrder.data;

  if (products.length === 0) {
    return {
      message: 'Tilauksessa ei ole tuotteita',
      type: ToastType.ERROR,
      data: null,
    };
  }

  try {
    const databases = await getAdminDatabases();

    const productsList =
      products.filter((item) => item.type === 'product').length > 0
        ? ((
            await listDocumentsWithApi<ProductDocument>(
              ProductDatabase.DatabaseId,
              ProductDatabase.CollectionId,
              [
                Query.equal(
                  '$id',
                  products
                    .filter((item) => item.type === 'product')
                    .map((item) => item.$id)
                ),
              ]
            )
          ).data ?? [])
        : [];

    const bundlesList =
      products.filter((item) => item.type === 'bundle').length > 0
        ? ((
            await listDocumentsWithApi<ProductDocument>(
              BundleDatabase.DatabaseId,
              BundleDatabase.CollectionId,
              [
                Query.equal(
                  '$id',
                  products
                    .filter((item) => item.type === 'bundle')
                    .map((item) => item.$id)
                ),
              ]
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

    const validProducts = [
      ...productsList.map((item) => item.$id),
      ...bundlesList.map((item) => item.$id),
    ];

    const orderItems = products
      .filter((item) => validProducts.includes(item.$id))
      .map((item) => {
        if (item.type === 'product')
          return { product: item.$id, quantity: item.quantity };
        if (item.type === 'bundle')
          return { bundle: item.$id, quantity: item.quantity };
      })
      .filter((item) => item !== undefined);

    if (
      orderCode.availableOrders <
      orderItems.reduce((acc, item) => acc + item.quantity, 0)
    ) {
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
        orderItems,
        orderContacts: {
          address: shippingAddress,
          name: shippingName,
        },
        orderNotes,
        orderShipped: null,
        orderCanceled: null,
      },
      [Permission.read(Role.user(user.$id))]
    );

    await databases.updateDocument(
      OrderCodeDatabase.DatabaseId,
      OrderCodeDatabase.CollectionId,
      orderCode.$id,
      {
        availableOrders:
          orderCode.availableOrders -
          orderItems.reduce((acc, item) => acc + item.quantity, 0),
      }
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
