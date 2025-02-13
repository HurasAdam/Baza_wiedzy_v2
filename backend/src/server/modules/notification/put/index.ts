import appAssert from '../../../../utils/appAssert.js';
import { EHttpCodes } from '../../../../enums/http.js';
import NotificationModel from '../../../../modules/notification/model.js';
import catchErrors from '../../../../utils/catchErrors.js';
import type express from 'express';

export default (): ((req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>) => {
  return catchErrors(async (req, res) => {
   
    const {id} = req.params;

    const notification = await NotificationModel.findById({_id:id});
    appAssert(notification, EHttpCodes.NOT_FOUND, 'Notification not found');

   await NotificationModel.findByIdAndUpdate(
        id,
        { isRead: true },
        { new: true }
      );

    res.status(EHttpCodes.OK).json({data:"Notification marked as read"});
  });
};
