import { EHttpCodes } from '../../../../enums/http.js';
import appAssert from '../../../../utils/appAssert.js';
import NotificationRepository from '../../repository/index.js';
import type ReadNotificationDto from './dto.js';

export default async (dto: ReadNotificationDto): Promise<void> => {
  const { id } = dto;

  const notificationRepo = new NotificationRepository();

  const notification = await notificationRepo.getById(id);
  appAssert(notification, EHttpCodes.NOT_FOUND, 'Notification not found');

  await notificationRepo.update(id, { isRead: true });
};
