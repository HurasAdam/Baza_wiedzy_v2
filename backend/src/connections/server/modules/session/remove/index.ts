import { EHttpCodes } from '../../../../../enums/http.js';
import RemoveSessionDto from '../../../../../modules/session/subModules/remove/dto.js';
import remove from '../../../../../modules/session/subModules/remove/index.js';
import catchErrors from '../../../../../utils/catchErrors.js';
import type { IRemoveSessionReq } from './types.js';
import type express from 'express';

export default (): ((req: IRemoveSessionReq, res: express.Response, next: express.NextFunction) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const dto = new RemoveSessionDto({ sessionId: req.params.id, userId: req.userId });

    await remove(dto);

    res.status(EHttpCodes.OK).json({ message: 'Session removed' });
  });
};
