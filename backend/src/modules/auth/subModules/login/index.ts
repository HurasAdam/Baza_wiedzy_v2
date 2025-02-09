import { EHttpCodes } from '../../../../enums/http.js';
import { refreshTokenSignOptions, signToken } from '../../../../tools/passwords.js';
import appAssert from '../../../../utils/appAssert.js';
import SessionModel from '../../../session/model.js';
import UserModel from '../../../user/model.js';
import type { ILoginParams } from './types.js';
import type { IRefreshTokenPayload } from '../../../../types/tokens.js';
import type { ICleanUser } from '../../../user/model.js';

export default async ({
  email,
  password,
  userAgent,
}: ILoginParams): Promise<{ user: ICleanUser; accessToken: string; refreshToken: string }> => {
  const user = await UserModel.findOne({ email });
  appAssert(user, EHttpCodes.UNAUTHORIZED, 'Invalid email or password');

  const isValid = await user.comparePassword(password);
  appAssert(isValid, EHttpCodes.UNAUTHORIZED, 'Invalid email or password');

  const userId = user._id;
  const session = await SessionModel.create({
    userId,
    userAgent,
  });

  const sessionInfo: IRefreshTokenPayload = {
    sessionId: session._id,
  };

  const refreshToken = signToken(sessionInfo, refreshTokenSignOptions);
  const accessToken = signToken({
    ...sessionInfo,
    userId,
  });
  return {
    user: user.omitPassword(),
    accessToken,
    refreshToken,
  };
};
