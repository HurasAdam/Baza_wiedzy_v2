import mongoose, { Schema } from 'mongoose';
import { compareValue, hashValue } from '../../tools/passwords.js';
import type { ObjectId } from 'mongodb';

export interface IUserEntity {
  _id: string | ObjectId;
  name: string;
  surname: string;
  email: string;
  password: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
  favourites: mongoose.Types.ObjectId[];
  role: string;
}

export type ICleanUser = Omit<IUserEntity, 'password'>;

export interface IUserDocument extends IUserEntity, mongoose.Document {
  _id: ObjectId;
  comparePassword(val: string): Promise<boolean>;
  omitPassword(): ICleanUser;
}

const userSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    verified: { type: Boolean, required: true, default: false },
    favourites: [{ type: Schema.Types.ObjectId, ref: 'Article' }],
    role: { type: String, required: true, default: 'user' }, // Default role is "user"
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next): Promise<void> {
  if (!this.isModified('password')) {
    next();
    return;
  }
  this.password = await hashValue(this.password);
  next();
});

userSchema.methods.comparePassword = async function (value: string): Promise<boolean> {
  return compareValue(value, this.password);
};

userSchema.methods.omitPassword = function (): IUserDocument {
  const user = this.toObject();
  delete user.password;
  return user;
};

const UserModel = mongoose.model<IUserDocument>('User', userSchema);
export default UserModel;
