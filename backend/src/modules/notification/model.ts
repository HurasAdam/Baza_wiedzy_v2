import mongoose from 'mongoose';
import type { INotification } from './types.js';

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, enum: ['info', 'warning', 'success'], required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    link: { type: String, default: null }, // Link do artykułu
    articleTitle: { type: String, default: null },
    articleProduct: { type: String, default: null },
  },
  { timestamps: true },
);

const NotificationModel = mongoose.model<INotification>('Notification', notificationSchema);
export default NotificationModel;
