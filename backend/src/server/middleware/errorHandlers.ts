import Log from 'simpl-loggar';
import { z } from 'zod';
import { EHttpCodes } from '../../enums/http.js';
import AppError from '../../errors/index.js';
import { clearAuthCookies } from '../../utils/cookies.js';
import type { ErrorRequestHandler, Response } from 'express';

const handleZodError = (res: Response, error: z.ZodError): void => {
  const errors = error.issues.map((err) => ({
    path: err.path.join('.'),
    message: err.message,
  }));

  res.status(EHttpCodes.BAD_REQUEST).json({
    errors,
    message: error.message,
  });
};

const handleAppError = (res: Response, error: AppError): void => {
  res.status(error.statusCode).json({
    message: error.message,
    errorCode: error.errorCode,
  });
};

const errorHandler: ErrorRequestHandler = (error, req, res, _next) => {
  Log.log('Error handler', `PATH: ${req.path}`, (error as Error).message,(error as Error).stack );

  if (req.path === 'REFRESH_PATH') {
    clearAuthCookies(res);
  }

  if (error instanceof z.ZodError) {
    handleZodError(res, error);
    return;
  }

  if (error instanceof AppError) {
    handleAppError(res, error);
    return;
  }

  res.status(EHttpCodes.INTERNAL_SERVER_ERROR).send('Internal Server Error');
};

export default errorHandler;
