import { EHttpCodes } from '../../../../enums/http.js';
import { EVerificationCodeType } from '../../../../enums/verification.js';
import { hashValue } from '../../../../tools/passwords.js';
import appAssert from '../../../../utils/appAssert.js';
import SessionRepository from '../../../session/repository/index.js';
import UserRepository from '../../../user/repository/index.js';
import { CleanUserEntity } from '../../../user/utils/entity.js';
import AuthRepository from '../../repository/index.js';
import type ResetPasswordDto from './dto.js';
import type { ICleanUser } from '../../../user/types.js';
import type { IAuthEntity } from '../../types.js';

/**
 * Export controller, for endpoint to reset password.
 * @param dto
 */
const resetPassword = async (dto: ResetPasswordDto): Promise<{ user: ICleanUser }> => {
  const { password, verificationCode } = dto;

  const authRepo = new AuthRepository();
  const sessionRepo = new SessionRepository();
  const userRepo = new UserRepository();

  const validCode = await authRepo.get({
    _id: verificationCode,
    type: EVerificationCodeType.PasswordReset,
    expiresAt: { $gt: new Date() },
  });
  appAssert(
    validCode || (validCode as IAuthEntity[]).length > 0,
    EHttpCodes.NOT_FOUND,
    'Invalid or expired verification code',
  );

  await userRepo.update(validCode[0]!.userId.toString(), {
    password: await hashValue(password),
  });
  const updatedUser = await userRepo.getById(validCode[0]!.userId.toString());
  appAssert(updatedUser, EHttpCodes.INTERNAL_SERVER_ERROR, 'Failed to reset password');

  await authRepo.remove(validCode[0]!._id as string);

  // delete all sessions
  await sessionRepo.removeMany({ userId: validCode[0]!.userId });

  return { user: new CleanUserEntity(updatedUser) };
};

export default resetPassword;
