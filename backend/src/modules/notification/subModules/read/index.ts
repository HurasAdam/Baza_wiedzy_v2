import { EHttpCodes } from '../../../../enums/http.js';
import appAssert from '../../../../utils/appAssert.js';
import NotificationModel from '../../model.js';
import type ReadNotificationDto from './dto.js';

export default async (dto: ReadNotificationDto): Promise<void> => {
  const { id } = dto;

  const notification = await NotificationModel.findById({ _id: id });
  appAssert(notification, EHttpCodes.NOT_FOUND, 'Notification not found');

  await NotificationModel.findByIdAndUpdate(id, { isRead: true }, { new: true });
};
