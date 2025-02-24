import { EHttpCodes } from '../../../../../enums/http.js';
import appAssert from '../../../../../utils/appAssert.js';
import UserModel from '../../../model.js';
import type GetUserDto from './dto.js';
import type { IUser } from '../../../model.js';

export default async (dto: GetUserDto): Promise<IUser> => {
  const { userId } = dto;

  const user = await UserModel.findById(userId);
  appAssert(user, EHttpCodes.NOT_FOUND, 'User not found');

  return user;
};
