'use server';

import { OrderDatabase } from '@/interfaces/order.interface';
import { OrderCode } from '@/interfaces/orderCode.interface';
import { createAdminClient } from '@/services/createAdminClient';
import { createDocument, listDocumentsWithApi } from '@/services/databases';
import { getLoggedInUser } from '@/services/userSession';
import { ToastType } from '@/store';

import { ID, Query, Users } from 'node-appwrite';
import { z } from 'zod';
import isAdmin from '@/lib/isAdmin';
import { codeSchema } from '@/lib/schemas';

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
  code: codeSchema,
});

export const createNewOrderCode = async (
  _prevState: { message: string; type: ToastType; data: string | null } | null,
  form: FormData
) => {
  const user = await getLoggedInUser();

  if (!user || isAdmin(user)) {
    return {
      message: 'Sinulla ei ole riittäviä käyttöoikeuksia',
      type: ToastType.ERROR,
      data: null,
    };
  }

  const parsedOrderCode = newOrderCodeSchema.safeParse({
    code: form.get('code'),
    availableOrders: form.get('availableOrders'),
    name: form.get('name'),
  });

  if (parsedOrderCode.success === false) {
    return {
      message: 'Virheellinen pyyntö',
      type: ToastType.ERROR,
      data: null,
    };
  }
  const { name, availableOrders, code } = parsedOrderCode.data;

  const adminClient = await createAdminClient();

  const existingCode = await listDocumentsWithApi<OrderCode>(
    OrderDatabase.DatabaseId,
    OrderDatabase.CollectionId,
    [Query.equal('code', code)]
  );

  if (existingCode.data && existingCode.data.length > 0) {
    return {
      message: 'Tilauskoodi on jo olemassa',
      type: ToastType.ERROR,
      data: null,
    };
  }

  const users = new Users(adminClient.account.client);

  const newUser = await users.create(
    code,
    undefined,
    undefined,
    undefined,
    name
  );

  const { data } = await createDocument<OrderCode>(
    OrderDatabase.DatabaseId,
    OrderDatabase.CollectionId,
    ID.unique(),
    {
      name: name,
      availableOrders: availableOrders,
      creator: user.email,
      code: code,
      userId: newUser.$id,
    }
  );

  if (data)
    return {
      message: `Tilauskoodi ${code} luotu`,
      type: ToastType.SUCCESS,
      data: data.$id,
    };

  return {
    message: 'Tilauksen koodin luonti epäonnistui',
    type: ToastType.ERROR,
    data: null,
  };
};
