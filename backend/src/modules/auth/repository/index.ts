import { EHttpCodes } from '../../../enums/http.js';
import { signToken } from '../../../tools/passwords.js';
import appAssert from '../../../utils/appAssert.js';
import { refreshTokenSignOptions } from '../../.../../../tools/passwords.js';
import SessionModel from '../../session/model.js';
import UserModel from '../../user/model.js';
import type { ICreateAccountParams } from '../../../types/account.js';
import type { ICleanUser } from '../../user/model.js';

// eslint-disable-next-line import/prefer-default-export
export const createAccount = async (
  data: ICreateAccountParams,
): Promise<{ user: ICleanUser; accessToken: string; refreshToken: string }> => {
  // verify email is not taken
  const existingUser = await UserModel.exists({
    email: data.email,
  });
  appAssert(!existingUser, EHttpCodes.CONFLICT, 'Email already in use');

  const user = await UserModel.create({
    name: data.name,
    surname: data.surname,
    email: data.email,
    password: data.password,
  });
  const userId = user._id;

  // TODO --send verification email

  // create session
  const session = await SessionModel.create({
    userId,
    userAgent: data.userAgent,
  });

  const refreshToken = signToken(
    {
      sessionId: session._id,
    },
    refreshTokenSignOptions,
  );
  const accessToken = signToken({
    userId,
    sessionId: session._id,
  });
  return {
    user: user.omitPassword(),
    accessToken,
    refreshToken,
  };
};
