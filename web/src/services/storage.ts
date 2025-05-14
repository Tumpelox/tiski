import { ID, Models } from 'node-appwrite';
import { createSessionClient } from './userSession';
import { FileData } from '@/interfaces/file.interface';
import { ErrorResponse, handleAppwriteError } from './appwrite';

export enum StorageErrors {
  NotFound = 'not_found',
  PermissionDenied = 'permission_denied',
}

const createFile = async (bucketId: string, id: string, data: File) => {
  try {
    const { storage, databases } = await createSessionClient();

    if (!(storage && databases))
      return { data: null, error: ErrorResponse.Unauthorized };

    const file = await storage.createFile(bucketId, id, data);

    if (!file) return { data: null, error: ErrorResponse.NotFound };

    return { data: file, error: null };
  } catch (error) {
    return handleAppwriteError(error);
  }
};

export const removeFile = async (bucketId: string, fileId: string) => {
  try {
    const { storage } = await createSessionClient();

    if (!storage) return { data: null, error: ErrorResponse.Unauthorized };

    await storage.deleteFile(bucketId, fileId);

    return { data: 'success', error: null };
  } catch (error) {
    return handleAppwriteError(error);
  }
};

export const getFile = (file: Models.File) => {
  return {
    src: new URL(
      `${process.env.APPWRITE_ENDPOINT as string}/storage/buckets/${file.bucketId}/files/${file.$id}/view?project=${process.env.APPWRITE_PROJECT as string}`
    ),
    name: file.name,
    size: file.sizeOriginal,
    type: file.mimeType,
  };
};

export const formatID = (file: FileData) => {
  const fileType = file.type.split('/')[1].slice(0, 4);

  const fileName = file.fileName.split('.')[0];

  const shortenFilename =
    fileName.length < 23 - fileType.length
      ? fileName
      : `${fileName.slice(0, 23 - fileType.length)}...${fileName.slice(fileName.length - 5, fileName.length - 1)}`;

  const string =
    `${shortenFilename}_${ID.unique(10).slice(4, 8 + 26 - shortenFilename.length)}.${fileType}`.trim();

  let legalString = '';

  for (const char of string) {
    if (char.match(/^[a-zA-Z0-9_.-]*$/)) {
      legalString += char;
    } else {
      legalString += '_';
    }
  }

  return legalString;
};

export default createFile;
