'use server';

import { BundleDatabase, BundleDocument } from '@/interfaces/bundle.interface';
import { Order, OrderDatabase } from '@/interfaces/order.interface';
import { OrderCodeDatabase } from '@/interfaces/orderCode.interface';
import {
  ProductDatabase,
  ProductDocument,
} from '@/interfaces/product.interface';
import orderSchema from '@/schemas/order.schema';
import {
  getAdminDatabases,
  getDocumentWithApi,
  listDocumentsWithApi,
  updateDocumentWithApi,
} from '@/services/databases';
import { getOrderCode } from '@/services/orderCode';
import { getLoggedInUser } from '@/services/userSession';
import { ToastType } from '@/store';

import { ID, Permission, Query, Role } from 'node-appwrite';
import { z } from 'zod';

interface OrderItem {
  product?: string;
  bundle?: string;
  quantity: number;
}

const updateProductStock = async (item: OrderItem) => {
  if (item.product !== undefined) {
    const { data } = await getDocumentWithApi<ProductDocument>(
      ProductDatabase.DatabaseId,
      ProductDatabase.DatabaseId,
      item.product
    );

    if (data) {
      await updateDocumentWithApi<ProductDocument>(
        ProductDatabase.DatabaseId,
        ProductDatabase.CollectionId,
        data.$id,
        {
          stock: data.stock - item.quantity,
        }
      );
    }
  }

  if (item.bundle !== undefined) {
    const { data } = await getDocumentWithApi<BundleDocument>(
      BundleDatabase.DatabaseId,
      BundleDatabase.CollectionId,
      item.bundle
    );

    if (data) {
      for (const product of data.products) {
        await updateDocumentWithApi<ProductDocument>(
          ProductDatabase.DatabaseId,
          ProductDatabase.CollectionId,
          product.$id,
          {
            stock: product.stock - item.quantity,
          }
        );
      }
    }
  }
};

export const newOrder = async (
  data: z.infer<typeof orderSchema>
): Promise<{ message: string; type: ToastType; data: string | null }> => {
  const { user } = await getLoggedInUser();

  if (!user) {
    return { message: 'Syötä koodi', type: ToastType.ERROR, data: null };
  }

  const orderCode = await getOrderCode(user);

  if (!orderCode) {
    return { message: 'Syötä koodi', type: ToastType.ERROR, data: null };
  }

  if (orderCode.orders)
    return {
      message: 'Koodilla on tehty jo tilaus',
      type: ToastType.ERROR,
      data: null,
    };

  if (orderCode.isActive === false)
    return {
      message: 'Koodi ei ole aktiivinen',
      type: ToastType.ERROR,
      data: null,
    };

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

    const order = await databases.createDocument<Order>(
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

    for (const item of orderItems) {
      await updateProductStock(item);
    }

    return {
      message: 'Tilauksen luonti onnistui',
      type: ToastType.SUCCESS,
      data: order.$id,
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
