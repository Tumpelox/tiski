'use server';

import { cookies } from 'next/headers';
import { Account, Client } from 'node-appwrite';

enum Keys {
  SessionCookie = 'Tiski_Session_Cookie',
}

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();

    return await account.get();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return null;
  }
}

export async function createSessionClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT as string);

  const session = (await cookies()).get(Keys.SessionCookie);
  if (!session || !session.value) {
    throw new Error('No session');
  }

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
  };
}

export async function createTokenSession(userId: string, secret: string) {
  const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('<PROJECT_ID>');

  const account = new Account(client);

  const session = await account.createSession(userId, secret);

  (await cookies()).set(Keys.SessionCookie, session.secret, {
    path: '/',
    httpOnly: true,
    sameSite: 'strict',
    secure: true,
  });
}
