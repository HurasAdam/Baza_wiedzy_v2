import { EHttpCodes } from '../../../../../enums/http.js';
import MarkFavDto from '../../../../../modules/article/subModules/favorite/mark/dto.js';
import markFavorite from '../../../../../modules/article/subModules/favorite/mark/index.js';
import catchErrors from '../../../utils/catchErrors.js';
import type { IMarkFavReq } from './types.js';
import type express from 'express';

/**
 * Export controller, for endpoint to marking article as favorite.
 * @returns MarkArticleAsFavorite.
 */
export default (): ((req: IMarkFavReq, res: express.Response, next: express.NextFunction) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const dto = new MarkFavDto(req);

    const isFavorite = await markFavorite(dto);

    res.status(EHttpCodes.OK).json({
      message: `${isFavorite ? 'Usunięto artykuł z listy ulubionych' : ' Dodano artkuł do listy ulubionych'}`,
    });
  });
};
