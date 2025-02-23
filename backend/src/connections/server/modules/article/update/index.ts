import { EHttpCodes } from '../../../../../enums/http.js';
import UpdateArticleDto from '../../../../../modules/article/subModules/update/dto.js';
import updateArticle from '../../../../../modules/article/subModules/update/index.js';
import catchErrors from '../../../../../utils/catchErrors.js';
import type { IUpdateArticleReq } from './types.js';
import type express from 'express';

export default (): ((req: IUpdateArticleReq, res: express.Response, next: express.NextFunction) => Promise<void>) => {
  return catchErrors<IUpdateArticleReq>(async (req, res) => {
    const dto = new UpdateArticleDto(req.body, req.params.id, req.userId);

    await updateArticle(dto);

    res.status(EHttpCodes.OK).json({ message: 'Artykuł został zaktualizowany' });
  });
};
