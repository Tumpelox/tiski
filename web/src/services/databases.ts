import { Databases, Models } from 'node-appwrite';
import { createAdminClient } from './createAdminClient';
import { createSessionClient } from './userSession';

export async function getAdminDatabases() {
  const client = await createAdminClient();

  return new Databases(client.account.client);
}

export const getDocumentWithApi = async <Type extends Models.Document>(
  databaseId: string,
  collectionId: string,
  documentId: string
): Promise<{ data: Type | null; error: DatabaseErrors | null }> => {
  try {
    const databases = await getAdminDatabases();

    const data = await databases.getDocument<Type>(
      databaseId,
      collectionId,
      documentId
    );

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching document:', error);
    return { data: null, error: DatabaseErrors.NotFound };
  }
};

export const listDocumentsWithApi = async <Type extends Models.Document>(
  databaseId: string,
  collectionId: string
): Promise<{ data: Type[] | null; error: DatabaseErrors | null }> => {
  try {
    const databases = await getAdminDatabases();

    const { documents } = await databases.listDocuments<Type>(
      databaseId,
      collectionId
    );

    return { data: documents, error: null };
  } catch (error) {
    console.error('Error fetching document:', error);
    return { data: null, error: DatabaseErrors.NotFound };
  }
};

export enum DatabaseErrors {
  NotFound = 'not_found',
  PermissionDenied = 'permission_denied',
}

export const getDocument = async <Type extends Models.Document>(
  databaseId: string,
  collectionId: string,
  documentId: string
): Promise<{ data: Type | null; error: DatabaseErrors | null }> => {
  try {
    const { account } = await createSessionClient();
    if (!account) return { data: null, error: DatabaseErrors.PermissionDenied };
    const databases = new Databases(account.client);

    const data = await databases.getDocument<Type>(
      databaseId,
      collectionId,
      documentId
    );

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching document:', error);
    return { data: null, error: DatabaseErrors.NotFound };
  }
};

export const listDocuments = async <Type extends Models.Document>(
  databaseId: string,
  collectionId: string
): Promise<{ data: Type[] | null; error: DatabaseErrors | null }> => {
  try {
    const { account } = await createSessionClient();
    if (!account) return { data: null, error: DatabaseErrors.PermissionDenied };
    const databases = new Databases(account.client);

    const { documents } = await databases.listDocuments<Type>(
      databaseId,
      collectionId
    );

    return { data: documents, error: null };
  } catch (error) {
    console.error('Error fetching document:', error);
    return { data: null, error: DatabaseErrors.NotFound };
  }
};
