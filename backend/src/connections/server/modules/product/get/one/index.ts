import { EHttpCodes } from '../../../../../../enums/http.js';
import GetProductDto from '../../../../../../modules/product/subModules/get/one/dto.js';
import get from '../../../../../../modules/product/subModules/get/one/index.js';
import catchErrors from '../../../../utils/catchErrors.js';
import type { IGetProductReq } from './types.js';
import type express from 'express';

/**
 * Export controller, for endpoint to get one product.
 * @returns GetOneProduct.
 */
export default (): ((req: IGetProductReq, res: express.Response, next: express.NextFunction) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const dto = new GetProductDto({ productId: req.params.id });

    const product = await get(dto);

    res.status(EHttpCodes.OK).json(product);
  });
};
