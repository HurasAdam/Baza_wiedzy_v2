import { EHttpCodes } from '../../../../../enums/http.js';
import CreateProductDto from '../../../../../modules/product/subModules/create/dto.js';
import createProduct from '../../../../../modules/product/subModules/create/index.js';
import catchErrors from '../../../utils/catchErrors.js';
import type { ICreateProductReq } from './types.js';
import type express from 'express';

export default (): ((req: ICreateProductReq, res: express.Response, next: express.NextFunction) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const dto = new CreateProductDto(req.body, req.userId);

    const newProduct = await createProduct(dto);

    res.status(EHttpCodes.OK).json(newProduct);
  });
};
