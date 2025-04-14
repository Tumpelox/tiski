'use server';

import { OrderDatabase } from '@/interfaces/order.interface';
import { Product } from '@/interfaces/product.interface';
import { getAdminDatabases } from '@/services/databases';
import { getOrderCode } from '@/services/orderCode';
import { getLoggedInUser } from '@/services/userSession';
import { ToastType } from '@/store';
import { redirect } from 'next/navigation';
import { ID, Permission, Role } from 'node-appwrite';
import { z } from 'zod';

export interface Order {
  items: Product[];
  shippingName: string;
  shippingAddress: string;
}

const orderSchema = z.object({
  items: z.array(z.object({ $id: z.string() })),
  shippingName: z.string(),
  shippingAddress: z.string(),
});

export const newOrder = async (order: Order) => {
  const parsedOrder = orderSchema.safeParse(order);

  if (parsedOrder.success === false) {
    return {
      message: 'Virheellinen pyyntö',
      type: ToastType.ERROR,
    };
  }

  const { items, shippingAddress, shippingName } = parsedOrder.data;

  const user = await getLoggedInUser();

  if (!user) {
    return { message: 'Syötä koodi', type: ToastType.ERROR };
  }

  const orderCode = await getOrderCode(user.$id);

  if (!orderCode) {
    return { message: 'Syötä koodi', type: ToastType.ERROR };
  }

  const databases = await getAdminDatabases();

  const newOrder = await databases.createDocument(
    OrderDatabase.DatabaseId,
    OrderDatabase.CollectionId,
    ID.unique(),
    {
      orderCode: orderCode.$id,
      products: items.map((item) => item.$id),
      bundles: [],
      shippingName: shippingName,
      shippingAddress: shippingAddress,
    },
    [
      Permission.read(Role.user(user.$id)),
      Permission.read(Role.label('admin')),
      Permission.update(Role.label('admin')),
      Permission.delete(Role.label('admin')),
    ]
  );

  redirect(`/tilaus/${newOrder.$id}`);
};
