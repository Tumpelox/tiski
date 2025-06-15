'use server';

import { BundleDatabase, BundleDocument } from '@/interfaces/bundle.interface';
import { Order, OrderDatabase } from '@/interfaces/order.interface';
import { OrderCodeDatabase } from '@/interfaces/orderCode.interface';
import {
  ProductDatabase,
  ProductDocument,
} from '@/interfaces/product.interface';
import isAdmin from '@/lib/isAdmin';
import orderSchema, {
  orderWithMotivationSchema,
  updateOrderSchema,
} from '@/schemas/order.schema';
import {
  getAdminDatabases,
  getDocumentWithApi,
  listDocuments,
  listDocumentsWithApi,
  updateDocument,
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

export const newOrderWithOutCode = async (
  data: z.infer<typeof orderWithMotivationSchema>
): Promise<{ message: string; type: ToastType; data: string | null }> => {
  const parsedOrder = orderWithMotivationSchema.safeParse(data);

  if (parsedOrder.success === false) {
    return {
      message: 'Virheellinen pyyntö',
      type: ToastType.ERROR,
      data: null,
    };
  }

  const {
    products,
    shippingAddress,
    shippingPostalCode,
    shippingCity,
    shippingPhoneNumber,
    shippingName,
    orderNotes,
    recaptchaToken,
  } = parsedOrder.data;

  const reCaptcha = await fetch(
    `https://recaptchaenterprise.googleapis.com/v1/projects/${process.env.RECAPTCHA_PROJECT_ID}/assessments?key=${process.env.RECAPTCHA_API_KEY}`,
    {
      method: 'POST',
      body: JSON.stringify({
        event: {
          token: recaptchaToken,
          expectedAction: 'submit_order',
          siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
        },
      }),
    }
  );

  const reCaptchaResponse = await reCaptcha.json();

  if (reCaptchaResponse.riskAnalysis.score < 0.5) {
    return {
      message: 'Tilauksen luonti epäonnistui',
      type: ToastType.ERROR,
      data: null,
    };
  }

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

    if (1 < orderItems.reduce((acc, item) => acc + item.quantity, 0)) {
      return {
        message: 'Tilauksessa on liikaa tuotteita',
        type: ToastType.ERROR,
        data: null,
      };
    }

    const currentDate = new Date();

    const order = await databases.createDocument<Order>(
      OrderDatabase.DatabaseId,
      OrderDatabase.CollectionId,
      ID.custom(
        `tilaus-${currentDate.getDate()}-${currentDate.getHours()}-${currentDate.getMinutes()}-${currentDate.getSeconds()}-${currentDate.getMilliseconds()}`
      ),
      {
        orderCode: null,
        orderItems,
        orderContacts: {
          address: shippingAddress + `, ${shippingPostalCode} ${shippingCity}`,
          name: shippingName,
          phone: shippingPhoneNumber,
          reCaptchaScore: reCaptchaResponse.riskAnalysis.score,
        },
        orderNotes,
        orderShipped: null,
        orderCanceled: null,
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

export const updateOrder = async (
  updateData: z.infer<typeof updateOrderSchema>
) => {
  try {
    const { user } = await getLoggedInUser();

    if (!user || !isAdmin(user)) {
      return {
        message: 'Sinulla ei ole riittäviä käyttöoikeuksia',
        type: ToastType.ERROR,
        data: null,
      };
    }

    const { success, data } = updateOrderSchema.safeParse(updateData);

    if (success === false) {
      return {
        message: 'Virheellinen pyyntö',
        type: ToastType.ERROR,
        data: null,
      };
    }
    const { $id, orderShipped, orderCanceled } = data;

    console.log('Updating order:', $id, {
      orderCanceled,
      orderShipped,
    });

    const result = await updateDocument<Order>(
      OrderDatabase.DatabaseId,
      OrderDatabase.CollectionId,
      $id,
      {
        orderCanceled,
        orderShipped,
      }
    );

    if (result.data) {
      return {
        message: `Tilaus ${result.data.$id} päivitetty`,
        type: ToastType.SUCCESS,
        data: result.data,
      };
    } else throw new Error('Code creation failed');
  } catch (error) {
    console.error('Tilauksen päivitys epäonnistui', error);
    return {
      message: 'Tilauksen päivitys epäonnistui',
      type: ToastType.ERROR,
      data: null,
    };
  }
};

export const downloadOrders = async () => {
  const { user } = await getLoggedInUser();
  if (!user) return null;
  if (!isAdmin(user)) return null;

  const orders = await listDocuments<Order>(
    OrderDatabase.DatabaseId,
    OrderDatabase.CollectionId,
    [Query.limit(10000)]
  );

  if (!orders.data) return null;

  return orders.data.map((order) => {
    return {
      numero: order.$id,
      nimi: order.orderContacts.name,
      osoite: order.orderContacts.address,
      puhelin: order.orderContacts.phone ?? 'Ei',
      paketteja: order.orderItems.reduce((acc, item) => acc + item.quantity, 0),
      lisätiedot: order.orderNotes ?? 'Ei',
    };
  });
};
