import type mongoose from 'mongoose';

export interface ICreateTag {
  name: string;
  createdBy: string;
}

export interface ITagEntity extends ICreateTag {
  _id: string | mongoose.Types.ObjectId;
  isDefault: boolean;
}

export interface ITag extends ITagEntity, mongoose.Document {
  _id: mongoose.Types.ObjectId;
}
