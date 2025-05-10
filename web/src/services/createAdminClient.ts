import { Account, Client } from 'node-appwrite';

export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT as string)
    .setProject(process.env.APPWRITE_PROJECT as string)
    .setKey(process.env.APPWRITE_API_KEY as string);

  return {
    get account() {
      return new Account(client);
    },
  };
}
