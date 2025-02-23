import NotificationModel from '../../model.js';
import type GetNotificationDto from './dto.js';
import type { INotification } from '../../model.js';

export default async (dto: GetNotificationDto): Promise<INotification[]> => {
  const { userId } = dto;

  return NotificationModel.find({ userId }).sort({ isRead: 1, createdAt: -1 }).exec();
};
