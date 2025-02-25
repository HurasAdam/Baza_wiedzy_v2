import mongoose, { Schema } from 'mongoose';
import type { IUser } from './types.js';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    favourites: {
      type: [Schema.Types.ObjectId],
      ref: 'Article',
    },
    role: {
      type: String,
      default: 'user',
    },
  },
  {
    timestamps: true,
  },
);

const UserModel = mongoose.model<IUser>('User', userSchema);
export default UserModel;
