import Log from 'simpl-loggar';
import AppError, * as errors from '../../../errors/index.js';
import { clearAuthCookies } from '../utils/cookies.js';
import type { IFullError } from '../../../types/errors.js';
import type { ErrorRequestHandler, Response } from 'express';

const handleAppError = (res: Response, error: AppError): void => {
  res.status(error.statusCode).json({
    message: error.message,
    errorCode: error.errorCode,
  });
};

const errorHandler: ErrorRequestHandler = (error: Error | IFullError, req, res, _next) => {
  Log.error('Error handler', `PATH: ${req.path}`, (error as Error).message, (error as Error).stack);

  // Handle incorrect data type error
  if (error.message.includes('is not valid JSON')) {
    Log.error('Error handler', 'Received req is not of json type', error.message, error.stack);
    const { message, name, statusCode } = new errors.IncorrectDataType();
    res.status(statusCode).json({ message, name });
    return;
  }

  // Handle javascript internal errors
  if (error.name === 'SyntaxError') {
    Log.error('Error handler', 'Generic err', error.message, error.stack);
    const { message, name, statusCode } = new errors.InternalError();
    res.status(statusCode).json({ message, name });
    return;
  }

  if (req.path === 'REFRESH_PATH') {
    clearAuthCookies(res);
  }

  if (error instanceof AppError || error instanceof errors.FullError) {
    handleAppError(res, error);
    return;
  }

  Log.error('Error handler', 'Generic error in code', error.message, error.stack);
  const { message, name, statusCode } = new errors.InternalError();
  res.status(statusCode).json({ message, name });
};

export default errorHandler;
