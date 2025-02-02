import AppError from '../errors/index.js';
import type { EAppErrorCode } from '../enums/errors.js';
import type { EHttpCodes } from '../enums/http.js';
import assert from 'node:assert';

type AppAssert = (
  condition: unknown,
  httpStatusCode: EHttpCodes,
  message: string,
  appErrorCode?: EAppErrorCode,
) => asserts condition;
/**
 * Asserts a condition and throws an AppError if the condition is falsy.
 * @param condition
 * @param httpStatusCode
 * @param message
 * @param appErrorCode
 */
const appAssert: AppAssert = (condition, httpStatusCode, message, appErrorCode) =>
  assert(condition, new AppError(httpStatusCode, message, appErrorCode));

export default appAssert;
