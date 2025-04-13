'use server';

import { Query, Users } from 'node-appwrite';
import { getAdminDatabases } from './databases';
import { OrderCode, OrderCodeDatabase } from '@/interfaces/orderCode.interface';
import { createAdminClient } from './createAdminClient';

export const loginWithCode = async (code: string) => {
  const databases = await getAdminDatabases();

  const adminClient = await createAdminClient();

  const codes = await databases.listDocuments<OrderCode>(
    OrderCodeDatabase.DatabaseId,
    OrderCodeDatabase.CollectionId,
    [Query.equal('code', code)]
  );

  if (codes.documents.length === 0) return { secret: null, userId: null };

  const orderCode = codes.documents[0];

  const users = new Users(adminClient.account.client);

  const token = await users.createToken(orderCode.userId, 32, 43200);

  return { secret: token.secret, userId: orderCode.userId };
};

export const getOrderCode = async (userId: string) => {
  const databases = await getAdminDatabases();

  const codes = await databases.listDocuments<OrderCode>(
    OrderCodeDatabase.DatabaseId,
    OrderCodeDatabase.CollectionId,
    [Query.equal('userId', userId)]
  );

  if (codes.documents.length === 0) return null;

  const orderCode = codes.documents[0];

  return orderCode;
};
