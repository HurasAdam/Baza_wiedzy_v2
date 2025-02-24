import Log from 'simpl-loggar';
import UserModel from '../model.js';
import type { IUserEntity } from '../model.js';
import type { FilterQuery } from 'mongoose';

export const getUser = async (data: FilterQuery<Partial<IUserEntity>>): Promise<IUserEntity[]> => {
  return UserModel.find(data).lean();
};

export const getOneUserById = async (_id: string): Promise<IUserEntity | null> => {
  return UserModel.findOne({ _id }).lean();
};

export const removeOneUser = async (_id: string): Promise<void> => {
  await UserModel.findOneAndDelete({ _id });
};

export const updateOneUser = async (_id: string, newElement: Partial<IUserEntity>): Promise<void> => {
  await UserModel.findOneAndUpdate({ _id }, newElement);
};

export const createNewUser = async (data: ICreateUser): Promise<string> => {
  Log.debug('User repo', 'Creating new user', data);

  const model = new UserModel(data);
  return (await model.save())._id.toString();
};
