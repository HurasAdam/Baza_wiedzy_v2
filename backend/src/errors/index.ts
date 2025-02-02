// eslint-disable-next-line max-classes-per-file
import { EAppErrorCode } from '../enums/index.js';
import type { EHttpCodes } from '../enums/index.js';

export class FullError extends Error {
  errorCode: EAppErrorCode | undefined = EAppErrorCode.Forbidden;
  statusCode: number = 500;
}

export default class AppError extends FullError {
  constructor(
    statusCode: EHttpCodes,
    override message: string,
    errorCode?: EAppErrorCode,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }
}
