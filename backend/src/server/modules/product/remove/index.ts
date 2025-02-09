import { EHttpCodes } from '../../../../enums/http.js';
import { deleteProduct } from '../../../../services/product.service.js';
import catchErrors from '../../../../utils/catchErrors.js';
import type express from 'express';

export default (): ((req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const { id } = req.params;

    const conversationTproduct = await deleteProduct({ productId: id as string });
    return res.status(EHttpCodes.OK).json(conversationTproduct);
  });
};
