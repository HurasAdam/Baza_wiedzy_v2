import { EHttpCodes } from '../../../../../enums/http.js';
import UpdateProductDto from '../../../../../modules/product/subModules/update/dto.js';
import update from '../../../../../modules/product/subModules/update/index.js';
import catchErrors from '../../../utils/catchErrors.js';
import type { IUpdateProductReq } from './types.js';
import type express from 'express';

/**
 * Export controller, for endpoint to update product.
 * @returns UpdateProduct.
 */
export default (): ((req: IUpdateProductReq, res: express.Response, next: express.NextFunction) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const dto = new UpdateProductDto({ ...req.body, productId: req.params.id });

    await update(dto);

    res.status(EHttpCodes.OK).json({ message: 'Produkt został zaktualizowany' });
  });
};
