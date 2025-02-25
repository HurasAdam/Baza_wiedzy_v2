// eslint-disable-next-line max-classes-per-file
import type { ICleanUser, IUserEntity } from '../types.js';
import type mongoose from 'mongoose';

export class UserEntity implements IUserEntity {
  readonly _id: string | mongoose.Types.ObjectId;
  readonly name: string;
  readonly surname: string;
  readonly email: string;
  readonly password: string;
  readonly verified: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly favourites: mongoose.Types.ObjectId[];
  readonly role: string;

  constructor(data: IUserEntity) {
    this._id = data._id;
    this.name = data.name;
    this.surname = data.surname;
    this.email = data.email;
    this.password = data.password;
    this.verified = data.verified;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.favourites = data.favourites;
    this.role = data.role;
  }
}

export class CleanUserEntity implements ICleanUser {
  readonly _id: string | mongoose.Types.ObjectId;
  readonly name: string;
  readonly surname: string;
  readonly email: string;
  readonly verified: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly favourites: mongoose.Types.ObjectId[];
  readonly role: string;

  constructor(data: IUserEntity) {
    this._id = data._id;
    this.name = data.name;
    this.surname = data.surname;
    this.email = data.email;
    this.verified = data.verified;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.favourites = data.favourites;
    this.role = data.role;
  }
}
