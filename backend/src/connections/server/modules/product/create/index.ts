import { EHttpCodes } from '../../../../../enums/http.js';
import CreateProductDto from '../../../../../modules/product/subModules/create/dto.js';
import createProductController from '../../../../../modules/product/subModules/create/index.js';
import catchErrors from '../../../utils/catchErrors.js';
import type { ICreateProductReq } from './types.js';
import type express from 'express';

/**
 * Export controller, for endpoint to create product.
 */
const createProduct = (): ((
  req: ICreateProductReq,
  res: express.Response,
  next: express.NextFunction,
) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const dto = new CreateProductDto(req.body, req.userId);

    const newProduct = await createProductController(dto);

    res.status(EHttpCodes.OK).json(newProduct);
  });
};

export default createProduct;
