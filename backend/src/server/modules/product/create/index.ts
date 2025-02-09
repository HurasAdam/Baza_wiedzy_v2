import { EHttpCodes } from '../../../../enums/http.js';
import { createProduct } from '../../../../modules/product/repository/index.js';
import { newProductSchema } from '../../../../modules/product/schema.js';
import catchErrors from '../../../../utils/catchErrors.js';
import type express from 'express';

export default (): ((req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const request = newProductSchema.parse(req.body);
    const { userId } = req;
    const newProduct = await createProduct({ request, userId });

    res.status(EHttpCodes.OK).json(newProduct);
  });
};
