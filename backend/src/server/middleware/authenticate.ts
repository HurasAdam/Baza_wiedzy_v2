import { EAppErrorCode, EHttpCodes } from '../../enums/index.js';
import { verifyToken } from '../../tools/passwords.js';
import appAssert from '../../utils/appAssert.js';
import type { IAccessTokenPayload } from '../../types/tokens.js';
import type { RequestHandler } from 'express';

const authenticate: RequestHandler = (req, _res, next) => {
  const accessToken = (req.cookies as Record<string, string>).accessToken as string | undefined;

  appAssert(accessToken, EHttpCodes.UNAUTHORIZED, 'Not authorized', EAppErrorCode.InvalidAccessToken);

  let payload: IAccessTokenPayload | undefined = undefined;
  let error: Error | undefined = undefined;

  try {
    const callback = verifyToken(accessToken);
    payload = (callback as { payload: IAccessTokenPayload })?.payload;

    if (payload && typeof payload.userId === 'string' && typeof payload.sessionId === 'string') {
      req.userId = payload.userId; // Teraz TypeScript wie, że to jest string
      req.sessionId = payload.sessionId; // Teraz TypeScript wie, że to jest string
    }
  } catch (err) {
    error = err as Error;
  }

  appAssert(
    payload,
    EHttpCodes.UNAUTHORIZED,
    error?.message === 'jwt expired' ? 'Token expired' : 'Invalid token',
    EAppErrorCode.InvalidAccessToken,
  );

  next();
};

export default authenticate;
