import NotificationRepository from '../../repository/index.js';
import type GetNotificationDto from './dto.js';
import type { INotificationEntity } from '../../types.js';

/**
 * Export controller, for endpoint to get notifications.
 * @param dto
 */
const getNotification = async (dto: GetNotificationDto): Promise<INotificationEntity[]> => {
  const { userId } = dto;

  const notificationRepo = new NotificationRepository();

  const notifications = await notificationRepo.get({ userId });

  return notifications
    .sort((a, b) => {
      if (a.isRead > b.isRead) return 1;
      if (a.isRead < b.isRead) return -1;
      return 0;
    })
    .sort((a, b) => {
      if (a.createdAt > b.createdAt) return -1;
      if (a.createdAt < b.createdAt) return 1;
      return 0;
    });
};

export default getNotification;
