import { model, Schema } from 'mongoose';
import type mongoose from 'mongoose';

export interface INotificationEntity {
  _id: string | mongoose.Types.ObjectId;
  userId: string | mongoose.Types.ObjectId;
  type: string;
  message: string;
  isRead: boolean;
  link: string;
  articleTitle: string;
  articleProduct: string;
}

export interface INotification extends mongoose.Document, INotificationEntity {
  _id: mongoose.Types.ObjectId;
}

const notificationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, enum: ['info', 'warning', 'success'], required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    link: { type: String, default: null }, // Link do artykułu
    articleTitle: { type: String, default: null }, // Tytuł artykułu
    articleProduct: { type: String, default: null }, // Powiązany produkt
  },
  { timestamps: true },
);

const NotificationModel = model<INotification>('Notification', notificationSchema);
export default NotificationModel;
