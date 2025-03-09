import { EHttpCodes } from '../../../../../enums/http.js';
import ReadNotificationsDto from '../../../../../modules/notification/subModules/read/dto.js';
import readNotification from '../../../../../modules/notification/subModules/read/index.js';
import catchErrors from '../../../utils/catchErrors.js';
import type { IReadNotificationsReq } from './types.js';
import type express from 'express';

/**
 * Export controller, for endpoint to read notification.
 * @returns GetNotification.
 */
export default (): ((
  req: IReadNotificationsReq,
  res: express.Response,
  next: express.NextFunction,
) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const dto = new ReadNotificationsDto(req.params);

    await readNotification(dto);

    res.status(EHttpCodes.OK).json({ data: 'Notification marked as read' });
  });
};
