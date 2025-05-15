import { Account, Client, Databases, Storage, Users } from 'node-appwrite';

export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT as string)
    .setProject(process.env.APPWRITE_PROJECT as string)
    .setKey(process.env.APPWRITE_API_KEY as string);

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
    get users() {
      return new Users(client);
    },
    get client() {
      return client;
    },
  };
}
