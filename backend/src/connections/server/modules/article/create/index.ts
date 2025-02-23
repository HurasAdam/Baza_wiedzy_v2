import { EHttpCodes } from '../../../../../enums/http.js';
import CreateArticlesDto from '../../../../../modules/article/subModules/create/dto.js';
import createArticle from '../../../../../modules/article/subModules/create/index.js';
import catchErrors from '../../../../../utils/catchErrors.js';
import type { ICreateArticleReq } from './types.js';
import type express from 'express';

export default (): ((req: ICreateArticleReq, res: express.Response, next: express.NextFunction) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const dto = new CreateArticlesDto({ ...req.body, userId: req.userId });
    const newArticle = await createArticle(dto);

    res.status(EHttpCodes.OK).json({ message: 'Dodano nowy artykuł', data: newArticle });
  });
};
