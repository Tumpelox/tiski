'use server';

import { OrderDatabase } from '@/interfaces/order.interface';
import { OrderCode } from '@/interfaces/orderCode.interface';
import { createAdminClient } from '@/services/createAdminClient';
import { getAdminDatabases } from '@/services/databases';
import { getLoggedInUser } from '@/services/userSession';
import { ToastType } from '@/store';
import { redirect } from 'next/navigation';
import { ID, Permission, Role, Users } from 'node-appwrite';
import { z } from 'zod';
import { codeSchema } from './auth';

export interface NewOrderCode {
  name: string;
  availableOrders: number;
  creator: string;
  code: string;
  userId: string;
}

const newOrderCodeSchema = z.object({
  name: z.string().min(2).max(128),
  availableOrders: z.number().min(1).max(100),
  creator: z.string().min(2).max(128),
  code: codeSchema,
  userId: z.string().min(3).max(32),
});

export const createNewOrderCode = async (newOrderCode: NewOrderCode) => {
  const user = await getLoggedInUser();

  if (!user) {
    return { message: 'Kirjaudu sisään', type: ToastType.ERROR };
  }

  if (!user.labels.includes('admin')) {
    return {
      message: 'Sinulla ei ole riittäviä käyttöoikeuksia',
      type: ToastType.ERROR,
    };
  }

  const parsedOrderCode = newOrderCodeSchema.safeParse(newOrderCode);
  if (parsedOrderCode.success === false) {
    return {
      message: 'Virheellinen pyyntö',
      type: ToastType.ERROR,
    };
  }
  const { name, availableOrders, code } = parsedOrderCode.data;

  const adminClient = await createAdminClient();

  const users = new Users(adminClient.account.client);

  const newUser = await users.create(ID.unique());

  const databases = await getAdminDatabases();

  const orderCode = await databases.createDocument<OrderCode>(
    OrderDatabase.DatabaseId,
    OrderDatabase.CollectionId,
    ID.unique(),
    {
      name: name,
      availableOrders: availableOrders,
      creator: user.$id,
      code: code,
      userId: newUser.$id,
    },
    [
      Permission.read(Role.label('admin')),
      Permission.update(Role.label('admin')),
      Permission.delete(Role.label('admin')),
    ]
  );

  redirect(`/tilauskoodit/${orderCode.$id}`);
};
