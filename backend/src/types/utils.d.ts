import type { EAppErrorCode } from '../enums/errors.ts';
import type { EHttpCodes } from '../enums/http.ts';
import type express from 'express';

export type AppAssert = (
  condition: unknown,
  httpStatusCode: EHttpCodes,
  message: string,
  appErrorCode?: EAppErrorCode,
) => asserts condition;

export type AsyncController = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => Promise<unknown>;
