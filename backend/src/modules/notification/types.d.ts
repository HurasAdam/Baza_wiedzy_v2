import type mongoose from 'mongoose';

export interface ICreateNotification {
  userId: string | mongoose.Types.ObjectId;
  type: string;
  message: string;
  link?: string;
  articleTitle?: string;
  articleProduct?: string;
}

export interface INotificationEntity extends ICreateNotification {
  _id: string | mongoose.Types.ObjectId;
  userId: string | mongoose.Types.ObjectId;
  isRead: boolean;
  link: string;
  articleTitle: string;
  articleProduct: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface INotification extends mongoose.Document, INotificationEntity {
  _id: mongoose.Types.ObjectId;
}
