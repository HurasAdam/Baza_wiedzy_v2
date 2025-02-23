import { EHttpCodes } from '../../../../../enums/http.js';
import GetNotificationDto from '../../../../../modules/notification/subModules/get/dto.js';
import getNotifications from '../../../../../modules/notification/subModules/get/index.js';
import catchErrors from '../../../../../utils/catchErrors.js';
import type { IGetNotificationsReq } from './types.js';
import type express from 'express';

export default (): ((
  req: IGetNotificationsReq,
  res: express.Response,
  next: express.NextFunction,
) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const dto = new GetNotificationDto({ userId: req.userId });

    const data = await getNotifications(dto);

    res.status(EHttpCodes.OK).json(data);
  });
};
