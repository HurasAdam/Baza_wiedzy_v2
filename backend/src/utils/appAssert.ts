import AppError from './AppError';
import type AppErrorCode from '../constants/appErrorCode';
import type { HttpStatusCode } from '../constants/http';
import assert from 'node:assert';

type AppAssert = (
  condition: any,
  httpStatusCode: HttpStatusCode,
  message: string,
  appErrorCode?: AppErrorCode,
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
