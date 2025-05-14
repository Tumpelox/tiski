import { AppwriteException } from 'node-appwrite';

export enum ErrorResponse {
  BadRequest = 'bad_request',
  Unauthorized = 'unauthorized',
  Forbidden = 'forbidden',
  NotFound = 'not_found',
  Unknown = 'unknown',
}

export const handleAppwriteError = (error: unknown) => {
  if (error instanceof AppwriteException) {
    switch (error.code) {
      case 400:
        return { data: null, error: ErrorResponse.BadRequest };
      case 401:
        return { data: null, error: ErrorResponse.Unauthorized };
      case 403:
        return { data: null, error: ErrorResponse.Forbidden };
      case 404:
        return { data: null, error: ErrorResponse.NotFound };
    }
  }
  return { data: null, error: ErrorResponse.Unknown };
};
