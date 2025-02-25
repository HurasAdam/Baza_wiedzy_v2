import { EHttpCodes } from '../../../../enums/http.js';
import { refreshTokenSignOptions, signToken } from '../../../../tools/passwords.js';
import appAssert from '../../../../utils/appAssert.js';
import SessionRepository from '../../../session/repository/index.js';
import UserRepository from '../../../user/repository/index.js';
import { CleanUserEntity } from '../../../user/utils/entity.js';
import { comparePassword } from '../../../user/utils/index.js';
import type LoginDto from './dto.js';
import type { IRefreshTokenPayload } from '../../../../types/tokens.js';

export default async (dto: LoginDto): Promise<{ user: CleanUserEntity; accessToken: string; refreshToken: string }> => {
  const { email, password } = dto;

  const userRepo = new UserRepository();
  const sessionRepo = new SessionRepository();

  const user = (await userRepo.get({ email }))[0]!;
  appAssert(user, EHttpCodes.UNAUTHORIZED, 'Invalid email or password');

  const isValid = await comparePassword(password, user.password);
  appAssert(isValid, EHttpCodes.UNAUTHORIZED, 'Invalid email or password');

  const userId = user._id;
  const sessionId = await sessionRepo.add({
    userId,
    userAgent: dto.userAgent!,
  });

  const sessionInfo: IRefreshTokenPayload = {
    sessionId,
  };

  const refreshToken = signToken(sessionInfo, refreshTokenSignOptions);
  const accessToken = signToken({
    ...sessionInfo,
    userId,
  });

  return {
    user: new CleanUserEntity(user),
    accessToken,
    refreshToken,
  };
};
