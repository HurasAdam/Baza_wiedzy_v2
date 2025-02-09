import { EHttpCodes } from '../../../../enums/http.js';
import { newArticleSchema } from '../../../../modules/article/schema.js';
import createArticle from '../../../../modules/article/subModules/create/index.js';
import catchErrors from '../../../../utils/catchErrors.js';
import type express from 'express';

export default (): ((req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const request = newArticleSchema.parse(req.body);
    const { userId } = req;
    const newArticle = await createArticle({ request, userId });

    res.status(EHttpCodes.OK).json({ message: 'Dodano nowy artykuł', data: newArticle });
  });
};
