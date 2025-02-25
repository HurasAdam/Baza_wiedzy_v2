import UserModel from '../../../model.js';
import type { IUserEntity } from '../../../types.js';

export default async (): Promise<IUserEntity[]> => {
  return UserModel.find({}).select(['-password', '-email', '-verified', '-createdAt', '-updatedAt', '-favourites']);
};
