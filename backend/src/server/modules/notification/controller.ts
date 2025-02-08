import NotificationModel from '../../../modules/notification/model.js';
import { EHttpCodes } from '../../../enums/http.js';
import catchErrors from '../../../utils/catchErrors.js';

export const getUserNotifications = catchErrors(async (req, res) => {
    const { userId } = req;
    const notifications = await NotificationModel.find({userId})
    .sort({ isRead: 1, createdAt: -1 })  
    .exec();
    return res.status(EHttpCodes.OK).json(notifications);
  });