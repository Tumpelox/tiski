'use server';

import { OrderCode, OrderCodeDatabase } from '@/interfaces/orderCode.interface';
import { createAdminClient } from '@/services/createAdminClient';
import {
  createDocument,
  getDocument,
  listDocumentsWithApi,
  removeDocument,
  updateDocument,
} from '@/services/databases';
import { getLoggedInUser } from '@/services/userSession';
import { ToastType } from '@/store';

import { ID, Query, Users } from 'node-appwrite';
import { z } from 'zod';
import isAdmin from '@/lib/isAdmin';
import {
  codeSchema,
  createCodeSchema,
  updateCodeSchema,
} from '@/schemas/orderCode.schema';

export const createNewOrderCode = async (
  newCodeData: z.infer<typeof createCodeSchema>
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

    const { success, data } = createCodeSchema.safeParse(newCodeData);

    if (success === false) {
      return {
        message: 'Virheellinen pyyntö',
        type: ToastType.ERROR,
        data: null,
      };
    }
    const { name, availableOrders, code } = data;

    const adminClient = await createAdminClient();

    const users = new Users(adminClient.account.client);

    const existingCode = await listDocumentsWithApi<OrderCode>(
      OrderCodeDatabase.DatabaseId,
      OrderCodeDatabase.CollectionId,
      [Query.equal('code', code)]
    );

    if (existingCode.data && existingCode.data.length > 0) {
      return {
        message: 'Tilauskoodi on jo olemassa',
        type: ToastType.ERROR,
        data: null,
      };
    } else {
      const newUser = await users.create(
        code,
        undefined,
        undefined,
        undefined,
        name
      );

      const { data } = await createDocument<OrderCode>(
        OrderCodeDatabase.DatabaseId,
        OrderCodeDatabase.CollectionId,
        ID.unique(),
        {
          name: name,
          availableOrders: availableOrders,
          creator: user.email,
          code: code,
          userId: newUser.$id,
          isActive: true,
        }
      );

      if (data) {
        return {
          message: `Tilauskoodi ${code} luotu`,
          type: ToastType.SUCCESS,
          data: data.$id,
        };
      } else throw new Error('Code creation failed');
    }
  } catch (error) {
    console.error('Error creating order code:', error);
    return {
      message: 'Tilauksen koodin luonti epäonnistui',
      type: ToastType.ERROR,
      data: null,
    };
  }
};

export const updateOrderCode = async (
  updateData: z.infer<typeof updateCodeSchema>
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

    const { success, data } = updateCodeSchema.safeParse(updateData);

    if (success === false) {
      return {
        message: 'Virheellinen pyyntö',
        type: ToastType.ERROR,
        data: null,
      };
    }
    const { $id, availableOrders, isActive } = data;

    console.log('Updating order code:', $id, {
      availableOrders: availableOrders,
      isActive: isActive,
    });
    const result = await updateDocument<OrderCode>(
      OrderCodeDatabase.DatabaseId,
      OrderCodeDatabase.CollectionId,
      $id,
      {
        availableOrders: availableOrders,
        isActive: isActive,
      }
    );

    if (result.data) {
      return {
        message: `Tilauskoodi ${result.data.code} päivitetty`,
        type: ToastType.SUCCESS,
        data: result.data,
      };
    } else throw new Error('Code creation failed');
  } catch (error) {
    console.error('Error creating order code:', error);
    return {
      message: 'Koodin päivitys epäonnistui',
      type: ToastType.ERROR,
      data: null,
    };
  }
};

export const deleteOrderCode = async ($id: string) => {
  try {
    const { user } = await getLoggedInUser();

    if (!user || !isAdmin(user)) {
      return {
        message: 'Sinulla ei ole riittäviä käyttöoikeuksia',
        type: ToastType.ERROR,
        data: null,
      };
    }

    const { success, data } = codeSchema.safeParse($id);

    if (success === false) {
      return {
        message: 'Virheellinen pyyntö',
        type: ToastType.ERROR,
        data: null,
      };
    }

    const currentOrderCode = await getDocument(
      OrderCodeDatabase.DatabaseId,
      OrderCodeDatabase.CollectionId,
      data
    );

    if (!currentOrderCode.data) throw new Error('Code not found');

    const adminClient = await createAdminClient();

    const users = new Users(adminClient.account.client);

    await users.delete(currentOrderCode.data.userId);

    const result = await removeDocument(
      OrderCodeDatabase.DatabaseId,
      OrderCodeDatabase.CollectionId,
      data
    );

    if (result.data) {
      return {
        message: `Tilauskoodi {code} poistettu`,
        type: ToastType.SUCCESS,
        data: result.data,
      };
    } else throw new Error('Code delete failed');
  } catch (error) {
    console.error('Error creating order code:', error);
    return {
      message: 'Koodin poisto epäonnistui',
      type: ToastType.ERROR,
      data: null,
    };
  }
};
