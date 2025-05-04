'use server';

import { Order, OrderDatabase } from '@/interfaces/order.interface';
import { Product } from '@/interfaces/product.interface';
import { getAdminDatabases } from '@/services/databases';
import { getOrderCode } from '@/services/orderCode';
import { getLoggedInUser } from '@/services/userSession';
import { ToastType } from '@/store';
import { redirect } from 'next/navigation';
import { ID, Permission, Role } from 'node-appwrite';
import { z } from 'zod';

export interface NewOrder {
  items: Product[];
  shippingName: string;
  shippingAddress: string;
  notes: string;
}

const orderSchema = z.object({
  products: z.array(z.object({ $id: z.string() })),
  bundles: z.array(z.object({ $id: z.string() })),
  shippingName: z.string(),
  shippingAddress: z.string(),
  notes: z.string().max(1024).optional(),
});

export const newOrder = async (order: NewOrder) => {
  const user = await getLoggedInUser();

  if (!user) {
    return { message: 'Syötä koodi', type: ToastType.ERROR };
  }

  const orderCode = await getOrderCode(user);

  if (!orderCode) {
    return { message: 'Syötä koodi', type: ToastType.ERROR };
  }

  const parsedOrder = orderSchema.safeParse(order);

  if (parsedOrder.success === false) {
    return {
      message: 'Virheellinen pyyntö',
      type: ToastType.ERROR,
    };
  }

  const { products, bundles, shippingAddress, shippingName } = parsedOrder.data;

  try {
    const databases = await getAdminDatabases();

    const newOrder = await databases.createDocument<Order>(
      OrderDatabase.DatabaseId,
      OrderDatabase.CollectionId,
      ID.custom(orderCode.$id),
      {
        orderCode: orderCode.$id,
        products: products.map((product) => product.$id),
        bundles: bundles.map((bundle) => bundle.$id),
        contacts: {
          address: shippingAddress,
          name: shippingName,
        },
        notes: null,
        shipped: null,
        canceled: null,
      },
      [
        Permission.read(Role.user(user.$id)),
        Permission.read(Role.label('admin')),
        Permission.update(Role.label('admin')),
        Permission.delete(Role.label('admin')),
      ]
    );

    return redirect(`/tilaus/${newOrder.$id}`);
  } catch (error) {
    console.error('Error creating order:', error);
    return {
      message: 'Tilauksen luonti epäonnistui',
      type: ToastType.ERROR,
    };
  }
};
