import { EHttpCodes } from '../../../../enums/http.js';
import { refreshTokenSignOptions, signToken } from '../../../../tools/passwords.js';
import appAssert from '../../../../utils/appAssert.js';
import SessionModel from '../../../session/model.js';
import UserRepository from '../../../user/repository/index.js';
import { CleanUserEntity } from '../../../user/utils/entity.js';
import type RegisterDto from './dto.js';

export default async (
  dto: RegisterDto,
): Promise<{ user: CleanUserEntity; accessToken: string; refreshToken: string }> => {
  const { email, password, surname, name } = dto;

  const userRepo = new UserRepository();

  // verify email is not taken
  const existingUser = await userRepo.get({
    email,
  });
  appAssert(!existingUser, EHttpCodes.CONFLICT, 'Email already in use');

  const userId = await userRepo.add({
    name,
    surname,
    email,
    password,
  });
  const user = await userRepo.getById(userId);

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
    user: new CleanUserEntity(user!),
    accessToken,
    refreshToken,
  };
};
