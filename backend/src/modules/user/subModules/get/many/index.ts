import UserModel from '../../../model.js';
import type { IUserEntity } from '../../../types.js';

/**
 * Export controller, for endpoint to get many users.
 */
const getManyUsers = async (): Promise<IUserEntity[]> => {
  return UserModel.find({}).select(['-password', '-email', '-verified', '-createdAt', '-updatedAt', '-favourites']);
};

export default getManyUsers;
