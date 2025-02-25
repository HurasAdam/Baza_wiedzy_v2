import type mongoose from 'mongoose';

export interface ICreateUser {
  name: string;
  surname: string;
  email: string;
  password: string;
}

export interface IUserEntity extends ICreateUser {
  _id: string | mongoose.Types.ObjectId;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
  favourites: mongoose.Types.ObjectId[];
  role: string;
}

export type ICleanUser = Omit<IUserEntity, 'password'>;

export interface IUser extends IUserEntity, mongoose.Document {
  _id: mongoose.Types.ObjectId;
  comparePassword(val: string): Promise<boolean>;
  omitPassword(): ICleanUser;
}
