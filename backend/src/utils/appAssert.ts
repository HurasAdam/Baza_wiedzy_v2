import AppError from '../errors/index.js';
import type { AppAssert } from '../types/utils.js';
import assert from 'node:assert';

/**
 * Asserts a condition and throws an AppError if the condition is falsy.
 * @param condition
 * @param httpStatusCode
 * @param message
 * @param appErrorCode
 */
const appAssert: AppAssert = (condition, httpStatusCode, message, appErrorCode) => {
  assert(condition, new AppError(httpStatusCode, message, appErrorCode));
};

export default appAssert;
