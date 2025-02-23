import type { EAppErrorCode } from '../enums/errors.ts';

export interface IFullError extends Error {
  errorCode: EAppErrorCode | undefined;
  statusCode: number;
}
