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

export async function getLoggedInUser() {
  const { account } = await createSessionClient();
  try {
    if (!account) return null;

    return await account.get();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    if (account) (await cookies()).delete(Keys.SessionCookie);
    return null;
  }
}

export async function createSessionClient() {
  try {
    const session = (await cookies()).get(Keys.SessionCookie);

    if (!session || !session.value) {
      throw new Error(AuthenicationErrors.SessionNotFound);
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return {
      get account() {
        return null;
      },
      get databases() {
        return null;
      },
    };
  }
}

export async function createTokenSession(userId: string, secret: string) {
  try {
    const { account } = await createAdminClient();
    const session = await account.createSession(userId, secret);

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

export async function createEmailAndPasswordSession(
  email: string,
  password: string
) {
  try {
    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);

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

export async function deleteSession() {
  const { account } = await createSessionClient();

  if (account) {
    const session = await account.getSession('current');

    await account.deleteSession(session.$id);

    (await cookies()).delete(Keys.SessionCookie);
  }
}
