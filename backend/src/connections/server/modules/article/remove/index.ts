import { EHttpCodes } from '../../../../../enums/http.js';
import RemoveArticleDto from '../../../../../modules/article/subModules/remove/dto.js';
import removeArticle from '../../../../../modules/article/subModules/remove/index.js';
import catchErrors from '../../../../../utils/catchErrors.js';
import type { IRemoveArticleReq } from './types.js';
import type express from 'express';

export default (): ((req: IRemoveArticleReq, res: express.Response, next: express.NextFunction) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const dto = new RemoveArticleDto(req.params);

    await removeArticle(dto);

    res.status(EHttpCodes.OK).json({ message: 'Artykuł i powiązana historia zostały usunięte.' });
  });
};
