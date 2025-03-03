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

/**
 * @openapi
 * components:
 *   schemas:
 *     InternalError:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Error name describing the error cause.
 *           example: 'InternalError'
 *         code:
 *           type: string
 *           description: Unique code associated with the error.
 *           example: '001'
 *         message:
 *           type: string
 *           description: Error message describing the error cause.
 *           example: 'Internal error. Try again later'
 */
export class InternalError extends FullError {
  constructor() {
    super('Internal error. Try again later');
    this.name = 'InternalError';
    this.errorCode = EAppErrorCode.InvalidAccessToken;
    this.statusCode = 500;
  }
}

/**
 * @openapi
 * components:
 *   schemas:
 *     IncorrectDataType:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Error name describing the error cause.
 *           example: 'IncorrectDataType'
 *         code:
 *           type: string
 *           description: Unique code associated with the error.
 *           example: '002'
 *         message:
 *           type: string
 *           description: Error message describing the error cause.
 *           example: 'Received request is not json type'
 */
export class IncorrectDataType extends FullError {
  constructor() {
    super('Received request is not json type');
    this.name = 'IncorrectDataType';
    this.errorCode = EAppErrorCode.InvalidAccessToken;
    this.statusCode = 400;
  }
}

/**
 * @openapi
 * components:
 *   schemas:
 *     MissingArgError:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Error name describing the error cause.
 *           example: 'MissingArgError'
 *         code:
 *           type: string
 *           description: Unique code associated with the error.
 *           example: '003'
 *         message:
 *           type: string
 *           description: Error message describing the error cause.
 *           pattern: "^Missing param: .+$"
 */
export class MissingArgError extends FullError {
  constructor(param: string) {
    super(`Missing param: ${param}`);
    this.name = 'MissingArgError';
    this.errorCode = EAppErrorCode.InvalidAccessToken;
    this.statusCode = 400;
  }
}

/**
 * @openapi
 * components:
 *   schemas:
 *     IncorrectArgError:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Error name describing the error cause.
 *           example: 'IncorrectArgError'
 *         code:
 *           type: string
 *           description: Unique code associated with the error.
 *           example: '004'
 *         message:
 *           type: string
 *           description: Error message describing the incorrect parameter.
 *           example: 'Data not provided'
 */
export class IncorrectArgError extends FullError {
  constructor(err: string) {
    super(err);
    this.name = 'IncorrectArgError';
    this.errorCode = EAppErrorCode.InvalidAccessToken;
    this.statusCode = 400;
  }
}

/**
 * @openapi
 * components:
 *   schemas:
 *     MissingProcessPlatformError:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Error name describing the error cause.
 *           example: 'MissingProcessPlatformError'
 *         code:
 *           type: string
 *           description: Unique code associated with the error.
 *           example: '005'
 *         message:
 *           type: string
 *           description: Error message describing the error cause.
 *           example: 'process.platform is missing'
 */
export class MissingProcessPlatformError extends FullError {
  constructor() {
    super('process.platform is missing');
    this.name = 'MissingProcessPlatformError';
    this.errorCode = EAppErrorCode.InvalidAccessToken;
    this.statusCode = 500;
  }
}

/**
 * @openapi
 * components:
 *   schemas:
 *     IncorrectArgLengthError:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Error name describing the error cause.
 *           example: 'IncorrectArgLengthError'
 *         code:
 *           type: string
 *           description: Unique code associated with the error.
 *           example: '006'
 *         message:
 *           type: string
 *           description: Error message describing the error cause.
 *           pattern: "^Element has incorrect length: .+$"
 */
export class IncorrectArgLengthError extends FullError {
  constructor(target: string, min: number | undefined, max: number) {
    super(
      min === undefined
        ? `${target} should be less than ${max} characters`
        : min !== max
          ? `${target} should be more than ${min} and less than ${max} characters`
          : `${target} should be ${min} characters`,
    );
    this.name = 'IncorrectArgLengthError';
    this.errorCode = EAppErrorCode.InvalidAccessToken;
    this.statusCode = 400;
  }
}

/**
 * @openapi
 * components:
 *   schemas:
 *     IncorrctArgTypeError:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Error name describing the error cause.
 *           example: 'IncorrectArgTypeError'
 *         code:
 *           type: string
 *           description: Unique code associated with the error.
 *           example: '007'
 *         message:
 *           type: string
 *           description: Error message describing the error cause.
 *           pattern: "^Element has incorrect length: .+$"
 */
export class IncorrectArgTypeError extends FullError {
  constructor(err: string) {
    super(err);
    this.name = 'IncorrectArgTypeError';
    this.errorCode = EAppErrorCode.InvalidAccessToken;
    this.statusCode = 400;
  }
}

/**
 * @openapi
 * components:
 *   schemas:
 *     ElementTooShortError:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Error name describing the error cause.
 *           example: 'ElementTooShortError'
 *         code:
 *           type: string
 *           description: Unique code associated with the error.
 *           example: '008'
 *         message:
 *           type: string
 *           description: Error message describing the error cause.
 *           pattern: "^Element .+$ is too short. Minimum length is .+$"
 */
export class ElementTooShortError extends FullError {
  constructor(target: string, min: number) {
    super(`Element ${target} is too short. Minimum length is ${min}`);
    this.name = 'ElementTooShortError';
    this.errorCode = EAppErrorCode.InvalidAccessToken;
    this.statusCode = 400;
  }
}

/**
 * @openapi
 * components:
 *   schemas:
 *     ElementTooLongError:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Error name describing the error cause.
 *           example: 'ElementTooLongError'
 *         code:
 *           type: string
 *           description: Unique code associated with the error.
 *           example: '009'
 *         message:
 *           type: string
 *           description: Error message describing the error cause.
 *           pattern: "^Element .+$ is too long. Maximum length is .+$"
 */
export class ElementTooLongError extends FullError {
  constructor(target: string, min: number) {
    super(`Element ${target} is too long. Maximum length is ${min}`);
    this.name = 'ElementTooShortLongError';
    this.errorCode = EAppErrorCode.InvalidAccessToken;
    this.statusCode = 400;
  }
}

/**
 * @openapi
 * components:
 *   schemas:
 *     UnauthorizedError:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Error name describing the error cause.
 *           example: 'UnauthorizedError'
 *         code:
 *           type: string
 *           description: Unique code associated with the error.
 *           example: '010'
 *         message:
 *           type: string
 *           description: Error message describing the error cause.
 *           example: 'User not logged in'
 */
export class UnauthorizedError extends FullError {
  constructor() {
    super('User not logged in');
    this.name = 'UnauthorizedError';
    this.errorCode = EAppErrorCode.InvalidAccessToken;
    this.statusCode = 401;
  }
}

/**
 * @openapi
 * components:
 *   schemas:
 *     NoPermissionError:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Error name describing the error cause.
 *           example: 'NoPermissionError'
 *         code:
 *           type: string
 *           description: Unique code associated with the error.
 *           example: '011'
 *         message:
 *           type: string
 *           description: Error message describing the error cause.
 *           example: 'You have no permission to make that action'
 */
export class NoPermissionError extends FullError {
  constructor() {
    super('You have no permission to make that action');
    this.name = 'NoPermission';
    this.errorCode = EAppErrorCode.InvalidAccessToken;
    this.statusCode = 400;
  }
}

/**
 * @openapi
 * components:
 *   schemas:
 *     NotConnectedError:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Error name describing the error cause.
 *           example: 'NotConnectedError'
 *         code:
 *           type: string
 *           description: Unique code associated with the error.
 *           example: '012'
 *         message:
 *           type: string
 *           description: Error message describing the error cause.
 *           example: 'Rabbit is not connected'
 */
export class NotConnectedError extends FullError {
  constructor() {
    super('Rabbit is not connected');
    this.name = 'NotConnectedError';
    this.errorCode = EAppErrorCode.InvalidAccessToken;
    this.statusCode = 500;
  }
}

/**
 * @openapi
 * components:
 *   schemas:
 *     IncorrectTargetError:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Error name describing the error cause.
 *           example: 'IncorrectTargetError'
 *         code:
 *           type: string
 *           description: Unique code associated with the error.
 *           example: '013'
 *         message:
 *           type: string
 *           description: Error message describing the error cause.
 *           example: 'Incorrect data target'
 */
export class IncorrectTargetError extends FullError {
  constructor() {
    super('Incorrect data target');
    this.name = 'IncorrectTargetError';
    this.errorCode = EAppErrorCode.InvalidAccessToken;
    this.statusCode = 400;
  }
}

/**
 * @openapi
 * components:
 *   schemas:
 *     UnregisteredControllerError:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Error name describing the error cause.
 *           example: 'UnregisteredControllerError'
 *         code:
 *           type: string
 *           description: Unique code associated with the error.
 *           example: '014'
 *         message:
 *           type: string
 *           description: Error message describing the error cause.
 *           example: 'Controllers with target ${target} were not registered !'
 */
export class UnregisteredControllerError extends FullError {
  constructor(target: string) {
    super(`Controllers with target ${target} were not registered !`);
    this.name = 'UnregisteredControllerError';
    this.errorCode = EAppErrorCode.InvalidAccessToken;
    this.statusCode = 500;
  }
}

/**
 * @openapi
 * components:
 *   schemas:
 *     ActionNotAllowed:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Error name describing the error cause.
 *           example: 'ActionNotAllowed'
 *         code:
 *           type: string
 *           description: Unique code associated with the error.
 *           example: '015'
 *         message:
 *           type: string
 *           description: Error message describing the error cause.
 *           example: "Action not allowed"
 */
export class ActionNotAllowed extends FullError {
  constructor() {
    super('Action not allowed');
    this.message = 'Action not allowed';
    this.name = 'ActionNotAllowed';
    this.errorCode = EAppErrorCode.InvalidAccessToken;
    this.statusCode = 400;
  }
}

/**
 * @openapi
 * components:
 *   schemas:
 *     IncorrectBodyTypeError:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Error name describing the error cause.
 *           example: 'IncorrectBodyTypeError'
 *         code:
 *           type: string
 *           description: Unique code associated with the error.
 *           example: '100'
 *         message:
 *           type: string
 *           description: Error message describing the error cause.
 *           example: "Incorrect body type. Data should be of type json"
 */
export class IncorrectBodyTypeError extends FullError {
  constructor() {
    super('Incorrect body type. Data should be of type json');
    this.name = 'IncorrectBodyTypeError';
    this.errorCode = EAppErrorCode.InvalidAccessToken;
    this.statusCode = 400;
  }
}

/**
 * @openapi
 * components:
 *   schemas:
 *     NoDataProvidedError:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Error name describing the error cause.
 *           example: 'NoDataProvidedError'
 *         code:
 *           type: string
 *           description: Unique code associated with the error.
 *           example: '101'
 *         message:
 *           example: 'No data provided'
 *           description: Error message describing the incorrect parameter.
 *           type: string
 */
export class NoDataProvidedError extends FullError {
  constructor() {
    super('No data provided');
    this.name = 'NoDataProvidedError';
    this.errorCode = EAppErrorCode.InvalidAccessToken;
    this.statusCode = 400;
  }
}

/**
 * @openapi
 * components:
 *   schemas:
 *     FourOhFour:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Error name describing the error cause.
 *           example: 'FourOhFour'
 *         code:
 *           type: string
 *           description: Unique code associated with the error.
 *           example: '102'
 *         message:
 *           type: string
 *           description: Error message describing the error cause.
 *           example: "Resource not found or is inaccessible for you"
 */
export class FourOhFour extends FullError {
  constructor() {
    super('Resource not found or is inaccessible for you');
    this.name = 'FourOhFour';
    this.errorCode = EAppErrorCode.InvalidAccessToken;
    this.statusCode = 404;
  }
}

/**
 * @openapi
 * components:
 *   schemas:
 *     InvalidRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Error name describing the error cause.
 *           example: 'InvalidRequest'
 *         code:
 *           type: string
 *           description: Unique code associated with the error.
 *           example: '103'
 *         message:
 *           type: string
 *           description: Error message describing the error cause.
 *           example: "Invalid request. This error means that there was a problem with user provided client data"
 */
export class InvalidRequest extends FullError {
  constructor() {
    super('Invalid request');
    this.name = 'InvalidRequest';
    this.errorCode = EAppErrorCode.InvalidAccessToken;
    this.statusCode = 400;
  }
}

/**
 * @openapi
 * components:
 *   schemas:
 *     IncorrectCredentialsError:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Error name describing the error cause.
 *           example: 'IncorrectCredentialsError'
 *         code:
 *           type: string
 *           description: Unique code associated with the error.
 *           example: '104'
 *         message:
 *           type: string
 *           description: Error message describing the error cause.
 *           example: "Incorrect credentials"
 */
export class IncorrectCredentialsError extends FullError {
  constructor(message?: string) {
    super(message ?? 'Incorrect credentials');
    this.name = 'IncorrectCredentialsError';
    this.errorCode = EAppErrorCode.InvalidAccessToken;
    this.statusCode = 400;
  }
}

/**
 * @openapi
 * components:
 *   schemas:
 *     NoUserWithProvidedName:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Error name describing the error cause.
 *           example: 'NoUserWithProvidedName'
 *         code:
 *           type: string
 *           description: Unique code associated with the error.
 *           example: '105'
 *         message:
 *           type: string
 *           description: Error message describing the error cause.
 *           example: "No user with provided name"
 */
export class NoUserWithProvidedName extends FullError {
  constructor(names?: string[]) {
    super(
      names
        ? names.length === 1
          ? `User ${names.join(', ')} does not exist`
          : `Users ${names.join(', ')} does not exist`
        : 'No user with provided name',
    );
    this.name = 'NoUserWithProvidedName';
    this.errorCode = EAppErrorCode.InvalidAccessToken;
    this.statusCode = 400;
  }
}

/**
 * @openapi
 * components:
 *   schemas:
 *     MissingMessageError:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Error name describing the error cause.
 *           example: 'MissingMessageError'
 *         code:
 *           type: string
 *           description: Unique code associated with the error.
 *           example: '301'
 *         message:
 *           type: string
 *           description: Error message describing the error cause.
 *           example: "Targeted message does not exist"
 */
export class MissingMessageError extends FullError {
  constructor() {
    super('Targeted message does not exist');
    this.name = 'MissingMessageError';
    this.errorCode = EAppErrorCode.InvalidAccessToken;
    this.statusCode = 400;
  }
}
