import { EHttpCodes } from '../../../../enums/http.js';
import NotificationModel from '../../../../modules/notification/model.js';
import catchErrors from '../../../../utils/catchErrors.js';
import type express from 'express';

export default (): ((req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const { userId } = req;
    const notifications = await NotificationModel.find({ userId }).sort({ isRead: 1, createdAt: -1 }).exec();
    return res.status(EHttpCodes.OK).json(notifications);
  });
};
