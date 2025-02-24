import Log from 'simpl-loggar';
import NotificationModel from '../model.js';
import type { INotificationEntity, ICreateNotification } from '../types.js';
import type { FilterQuery } from 'mongoose';

export const getNotifications = async (
  data: FilterQuery<Partial<INotificationEntity>>,
): Promise<INotificationEntity[]> => {
  return NotificationModel.find(data).lean();
};

export const getOneNotificationById = async (_id: string): Promise<INotificationEntity | null> => {
  return NotificationModel.findOne({ _id }).lean();
};

export const removeOneNotification = async (_id: string): Promise<void> => {
  await NotificationModel.findOneAndDelete({ _id });
};

export const updateNotification = async (_id: string, newElement: Partial<INotificationEntity>): Promise<void> => {
  await NotificationModel.findOneAndUpdate({ _id }, newElement);
};

export const createNewNotification = async (data: ICreateNotification): Promise<string> => {
  Log.debug('Notification repo', 'Creating new notification', data);

  const model = new NotificationModel(data);
  return (await model.save())._id.toString();
};
