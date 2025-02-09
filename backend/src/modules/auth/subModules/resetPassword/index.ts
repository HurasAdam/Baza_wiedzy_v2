import { EHttpCodes } from '../../../../enums/http.js';
import { EVerificationCodeType } from '../../../../enums/verification.js';
import { hashValue } from '../../../../tools/passwords.js';
import appAssert from '../../../../utils/appAssert.js';
import SessionModel from '../../../session/model.js';
import UserModel from '../../../user/model.js';
import verificationCodeModel from '../../model.js';
import type { IResetPasswordParams } from '../../../../types/account.js';
import type { ICleanUser } from '../../../user/model.js';

export default async ({ verificationCode, password }: IResetPasswordParams): Promise<{ user: ICleanUser }> => {
  const validCode = await verificationCodeModel.findOne({
    _id: verificationCode,
    type: EVerificationCodeType.PasswordReset,
    expiresAt: { $gt: new Date() },
  });
  appAssert(validCode, EHttpCodes.NOT_FOUND, 'Invalid or expired verification code');

  const updatedUser = await UserModel.findByIdAndUpdate(validCode.userId, {
    password: await hashValue(password),
  });
  appAssert(updatedUser, EHttpCodes.INTERNAL_SERVER_ERROR, 'Failed to reset password');

  await validCode.deleteOne();

  // delete all sessions
  await SessionModel.deleteMany({ userId: validCode.userId });

  return { user: updatedUser.omitPassword() };
};
