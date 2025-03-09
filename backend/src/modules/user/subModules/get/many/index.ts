import UserModel from '../../../model.js';
import type { IUserEntity } from '../../../types.js';

/**
 * Export controller, for endpoint to get many users.
 * @returns GetManyUsers.
 */
export default async (): Promise<IUserEntity[]> => {
  return UserModel.find({}).select(['-password', '-email', '-verified', '-createdAt', '-updatedAt', '-favourites']);
};
