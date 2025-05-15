import { cookies } from 'next/headers';
import { Account, Client, Databases, Storage } from 'node-appwrite';
import { createAdminClient } from './createAdminClient';
import { handleAppwriteError } from './appwrite';

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
  try {
    const { account } = await createSessionClient();
    if (!account)
      return { user: null, error: AuthenicationErrors.SessionFailed };

    return { user: await account.get(), error: null };
  } catch (error) {
    const info = handleAppwriteError(error);
    return {
      user: null,
      error: info.error,
    };
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
      get storage() {
        return new Storage(client);
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
      get storage() {
        return null;
      },
    };
  }
}

export async function createTokenSession(userId: string, secret: string) {
  const { account } = await createAdminClient();
  const session = await account.createSession(userId, secret);

  (await cookies()).set(Keys.SessionCookie, session.secret, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    expires: new Date(session.expire),
    path: '/',
  });
}

export async function createEmailAndPasswordSession(
  email: string,
  password: string
) {
  const { account } = await createAdminClient();
  const session = await account.createEmailPasswordSession(email, password);

  (await cookies()).set(Keys.SessionCookie, session.secret, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    expires: new Date(session.expire),
    path: '/',
  });
}

export async function deleteSession() {
  const { account } = await createSessionClient();

  if (account) {
    try {
      const session = await account.getSession('current');

      await account.deleteSession(session.$id);
    } catch (error) {
      handleAppwriteError(error);
    }
  }

  (await cookies()).delete(Keys.SessionCookie);
}
