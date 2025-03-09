import { EHttpCodes } from '../../../../../enums/http.js';
import appAssert from '../../../../../utils/appAssert.js';
import UserRepository from '../../../repository/index.js';
import type GetUserDto from './dto.js';
import type { IUserEntity } from '../../../types.js';

/**
 * Export controller, for endpoint to get one user.
 * @param dto
 * @returns GetOneUser.
 */
export default async (dto: GetUserDto): Promise<IUserEntity> => {
  const { userId } = dto;

  const userRepo = new UserRepository();

  const user = await userRepo.getById(userId);
  appAssert(user, EHttpCodes.NOT_FOUND, 'User not found');

  return user;
};
