'use server';

import { Databases } from "node-appwrite";
import { createAdminClient } from "./createAdminClient";

export async function getAdminDatabases() {
  const client = await createAdminClient();

  return new Databases(client.account.client);
}
