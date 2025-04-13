import { OrderDatabase } from '@/interfaces/order.interface';
import { OrderCode } from '@/interfaces/orderCode.interface';
import { createAdminClient } from '@/services/createAdminClient';
import { getAdminDatabases } from '@/services/databases';
import { getLoggedInUser } from '@/services/userSession';
import { redirect } from 'next/navigation';
import { ID, Permission, Role, Users } from 'node-appwrite';

export interface NewOrderCode {
  name: string;
  availableOrders: number;
  creator: string;
  code: string;
  userId: string;
}

export const createNewOrderCode = async (newOrderCode: NewOrderCode) => {
  const user = await getLoggedInUser();

  if (!user) {
    console.error('User not found. Cannot create order code.');
    return null;
  }

  const adminLabel = process.env.APPWRITE_ADMIN_LABEL_ID;

  if (!adminLabel) {
    console.error('Admin team ID is not set in environment variables.');
    return null;
  }

  if (!user.labels.includes(adminLabel)) {
    console.error('User is not an admin. Cannot create order code.');
    return null;
  }

  const adminClient = await createAdminClient();

  const users = new Users(adminClient.account.client);

  const newUser = await users.create(ID.unique());

  const databases = await getAdminDatabases();

  const orderCode = await databases.createDocument<OrderCode>(
    OrderDatabase.DatabaseId,
    OrderDatabase.CollectionId,
    ID.unique(),
    {
      name: newOrderCode.name,
      availableOrders: newOrderCode.availableOrders,
      creator: user.$id,
      code: newOrderCode.code,
      userId: newUser.$id,
    },
    [
      Permission.read(Role.label(adminLabel)),
      Permission.update(Role.label(adminLabel)),
      Permission.delete(Role.label(adminLabel)),
    ]
  );

  redirect(`/tilauskoodit/${orderCode.$id}`);
};
