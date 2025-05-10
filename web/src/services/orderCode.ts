import { Models, Query, Users } from 'node-appwrite';
import { getAdminDatabases } from './databases';
import {
  CanAddToCart,
  OrderCode,
  OrderCodeDatabase,
} from '@/interfaces/orderCode.interface';
import { createAdminClient } from './createAdminClient';
import { getLoggedInUser } from './userSession';

export const loginWithCode = async (code: string) => {
  try {
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
  } catch (error) {
    console.error('Error logging in with code:', error);
    return { secret: null, userId: null };
  }
};

export const getOrderCode = async (
  user: Models.User<Models.Preferences> | null
) => {
  if (!user) return null;

  try {
    const databases = await getAdminDatabases();

    const codes = await databases.listDocuments<OrderCode>(
      OrderCodeDatabase.DatabaseId,
      OrderCodeDatabase.CollectionId,
      [Query.equal('userId', user.$id), Query.limit(1)]
    );

    if (codes.documents.length === 0) return null;

    const orderCode = codes.documents[0];

    return orderCode;
  } catch (error) {
    console.error('Error fetching order code:', error);
    return null;
  }
};

export const canAddToCart = async () => {
  const user = await getLoggedInUser();
  if (!user) return CanAddToCart.CodeNotFound;

  const orderCode = await getOrderCode(user);

  if (!orderCode) return CanAddToCart.CodeNotFound;

  if (orderCode.orders.length >= 1) return CanAddToCart.AlreadyOrdedered;
  return CanAddToCart.Ok;
};
