import { EHttpCodes } from '../../../../enums/http.js';
import { refreshTokenSignOptions, signToken } from '../../../../tools/passwords.js';
import appAssert from '../../../../utils/appAssert.js';
import SessionModel from '../../../session/model.js';
import UserModel from '../../../user/model.js';
import type RegisterDto from './dto.js';
import type { ICleanUser } from '../../../user/model.js';

export default async (dto: RegisterDto): Promise<{ user: ICleanUser; accessToken: string; refreshToken: string }> => {
  const { email, password, surname, name } = dto;

  // verify email is not taken
  const existingUser = await UserModel.exists({
    email,
  });
  appAssert(!existingUser, EHttpCodes.CONFLICT, 'Email already in use');

  const user = await UserModel.create({
    name,
    surname,
    email,
    password,
  });
  const userId = user._id;

  // TODO --send verification email

  // create session
  const session = await SessionModel.create({
    userId,
    userAgent: dto.userAgent,
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
