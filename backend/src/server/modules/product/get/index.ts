import { EHttpCodes } from '../../../../enums/http.js';
import ProductModel from '../../../../modules/product/model.js';
import { getSingleProduct } from '../../../../modules/product/repository/index.js';
import catchErrors from '../../../../utils/catchErrors.js';
import type express from 'express';

export const getMany = (): ((
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => Promise<void>) => {
  return catchErrors(async (_req, res) => {
    const tags = await ProductModel.find({}).select(['-createdBy']);
    res.status(EHttpCodes.OK).json(tags);
  });
};

export const getSingle = (): ((
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const { id } = req.params;
    const product = await getSingleProduct({ productId: id as string });
    res.status(EHttpCodes.OK).json(product);
  });
};
