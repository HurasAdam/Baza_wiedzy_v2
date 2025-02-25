import RepositoryFactory from '../../../tools/abstract/repository.js';
import NotificationModel from '../model.js';
import type { EControllers } from '../../../enums/controller.js';
import type { INotification } from '../types.js';

export default class NotificationRepository extends RepositoryFactory<
  INotification,
  typeof NotificationModel,
  EControllers.Notification
> {
  constructor() {
    super(NotificationModel);
  }
}
