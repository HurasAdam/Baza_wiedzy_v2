import { EHttpCodes } from '../../../../enums/http.js';
import { UnauthorizedError } from '../../../../errors/index.js';
import { refreshTokenSignOptions, signToken, verifyToken } from '../../../../tools/passwords.js';
import appAssert from '../../../../utils/appAssert.js';
import { oneDay, thirtyDaysFromNow } from '../../../../utils/date.js';
import SessionRepository from '../../../session/repository/index.js';
import type { IAccessTokenPayload, IRefreshTokenPayload } from '../../../../types/tokens.js';

export default async (refreshToken: string): Promise<{ accessToken: string; newRefreshToken: string | undefined }> => {
  const { payload } = verifyToken<IRefreshTokenPayload>(refreshToken, {
    secret: refreshTokenSignOptions.secret,
  }) as { payload: IAccessTokenPayload };
  appAssert(payload, EHttpCodes.UNAUTHORIZED, 'Invalid refresh token');

  const sessionRepo = new SessionRepository();

  const session = await sessionRepo.getById(payload.sessionId as string);
  if (!session) throw new UnauthorizedError();

  const now = Date.now();
  appAssert(session.expiresAt.getTime() > now, EHttpCodes.UNAUTHORIZED, 'Session expired');

  // refresh the session if it expires in the next 24hrs
  const sessionNeedsRefresh = session.expiresAt.getTime() - now <= oneDay;
  if (sessionNeedsRefresh) {
    session.expiresAt = thirtyDaysFromNow();
    await sessionRepo.update(session._id as string, { expiresAt: thirtyDaysFromNow() });
  }

  const newRefreshToken = sessionNeedsRefresh
    ? signToken(
        {
          sessionId: session._id,
        },
        refreshTokenSignOptions,
      )
    : undefined;

  const accessToken = signToken({
    userId: session.userId,
    sessionId: session._id,
  });

  return {
    accessToken,
    newRefreshToken,
  };
};
