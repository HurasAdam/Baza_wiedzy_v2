import { EHttpCodes } from '../../../../enums/http.js';
import { markFavorite } from '../../../../modules/article/index.js';
import catchErrors from '../../../../utils/catchErrors.js';
import type express from 'express';

export default (): ((req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const { id } = req.params;
    const { userId }: { userId: string } = req;

    const isFavorite = await markFavorite(id as string, userId);

    res.status(EHttpCodes.OK).json({
      message: `${isFavorite ? 'Usunięto artykuł z listy ulubionych' : ' Dodano artkuł do listy ulubionych'}`,
    });
  });
};
