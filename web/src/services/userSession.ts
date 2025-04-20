import { cookies } from 'next/headers';
import { Account, Client, Databases } from 'node-appwrite';
import { createAdminClient } from './createAdminClient';

enum Keys {
  SessionCookie = 'Tiski_Session_Cookie',
}

export enum AuthenicationErrors {
  SessionNotFound = 'Session not found',
  SessionFailed = 'Session failed',
}

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT as string)
  .setProject(process.env.APPWRITE_PROJECT as string);

const account = new Account(client);

export async function getLoggedInUser() {
  const sessionClient = await createSessionClient();

  if (!sessionClient.account) return null;

  return await sessionClient.account.get();
}

export async function createSessionClient() {
  const session = (await cookies()).get(Keys.SessionCookie);

  if (!session || !session.value) {
    return {
      get account() {
        return null;
      },
      get databases() {
        return null;
      },
    };
  }

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
  };
}

export async function createTokenSession(userId: string, secret: string) {
  try {
    const session = await account.createSession(userId, secret);

    (await cookies()).set(Keys.SessionCookie, session.secret, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
    });
  } catch (error) {
    console.error('Error creating session:', error);
    throw new Error(AuthenicationErrors.SessionFailed);
  }
}

export async function createEmailAndPasswordSession(
  email: string,
  password: string
) {
  try {
    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);
    console.log('Session to be created:', session);
    (await cookies()).set(Keys.SessionCookie, session.secret, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      expires: new Date(session.expire),
      path: '/',
    });
  } catch (error) {
    console.error('Error creating session:', error);
    throw new Error(AuthenicationErrors.SessionFailed);
  }
}
