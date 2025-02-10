import { EHttpCodes } from '../../../../enums/http.js';
import { getTag, getTags } from '../../../../modules/tag/repository/index.js';
import catchErrors from '../../../../utils/catchErrors.js';
import type express from 'express';

export const getSingle = (): ((
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const { id } = req.params;
    const tag = await getTag({ tagId: id as string });
    res.status(EHttpCodes.OK).json(tag);
  });
};

export const getMany = (): ((
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => Promise<void>) => {
  return catchErrors(async (req, res) => {
   

const {tags,totalCount} = await getTags({req})
    // Zwracamy dane
    res.status(200).json({
      tags,
      totalCount,
    });
  });
};
