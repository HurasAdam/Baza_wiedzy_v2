import { EHttpCodes } from '../../../../enums/http.js';
import { refreshTokenSignOptions, signToken, verifyToken } from '../../../../tools/passwords.js';
import appAssert from '../../../../utils/appAssert.js';
import { oneDay, thirtyDaysFromNow } from '../../../../utils/date.js';
import SessionModel from '../../../session/model.js';
import type { IAccessTokenPayload, IRefreshTokenPayload } from '../../../../types/tokens.js';

export default async (refreshToken: string): Promise<{ accessToken: string; newRefreshToken: string | undefined }> => {
  const { payload } = verifyToken<IRefreshTokenPayload>(refreshToken, {
    secret: refreshTokenSignOptions.secret,
  }) as { payload: IAccessTokenPayload };
  appAssert(payload, EHttpCodes.UNAUTHORIZED, 'Invalid refresh token');

  const session = await SessionModel.findById(payload.sessionId);
  const now = Date.now();
  appAssert(session && session.expiresAt.getTime() > now, EHttpCodes.UNAUTHORIZED, 'Session expired');

  // refresh the session if it expires in the next 24hrs
  const sessionNeedsRefresh = session.expiresAt.getTime() - now <= oneDay;
  if (sessionNeedsRefresh) {
    session.expiresAt = thirtyDaysFromNow();
    await session.save();
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
