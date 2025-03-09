import { EHttpCodes } from '../../../../../enums/http.js';
import RemoveProductDto from '../../../../../modules/product/subModules/remove/dto.js';
import remove from '../../../../../modules/product/subModules/remove/index.js';
import catchErrors from '../../../utils/catchErrors.js';
import type { IRemoveProductReq } from './types.js';
import type express from 'express';

/**
 * Export controller, for endpoint to remove product.
 * @returns RemoveProduct.
 */
export default (): ((req: IRemoveProductReq, res: express.Response, next: express.NextFunction) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const dto = new RemoveProductDto({ productId: req.params.id });

    const conversationTproduct = await remove(dto);

    res.status(EHttpCodes.OK).json(conversationTproduct);
  });
};
