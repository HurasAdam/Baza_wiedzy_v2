import UserModel from '../../../model.js';
import type { IUser } from '../../../model.js';

export default async (): Promise<IUser[]> => {
  return UserModel.find({}).select(['-password', '-email', '-verified', '-createdAt', '-updatedAt', '-favourites']);
};
