import { EHttpCodes } from '../../../../../enums/http.js';
import RemoveTagDto from '../../../../../modules/tag/subModules/remove/dto.js';
import remove from '../../../../../modules/tag/subModules/remove/index.js';
import catchErrors from '../../../utils/catchErrors.js';
import type { IRemoveTagReq } from './types.js';
import type express from 'express';

export default (): ((req: IRemoveTagReq, res: express.Response, next: express.NextFunction) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const dto = new RemoveTagDto({ id: req.params.id as string });

    const { message } = await remove(dto);

    res.status(EHttpCodes.OK).json({ message });
  });
};
