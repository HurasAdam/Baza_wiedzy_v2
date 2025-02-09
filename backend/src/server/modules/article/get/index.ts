import { EHttpCodes } from '../../../../enums/http.js';
import { getArticle, incrementArticleViews } from '../../../../modules/article/index.js';
import catchErrors from '../../../../utils/catchErrors.js';
import type express from 'express';

export default (): ((req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const { userId }: { userId: string } = req;
    const { id } = req.params;

    const article = await getArticle({ userId, articleId: id as string });
    await incrementArticleViews({ articleId: article?._id.toString() });
    return res.status(EHttpCodes.OK).json(article);
  });
};
