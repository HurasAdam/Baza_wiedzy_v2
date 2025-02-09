import { EHttpCodes } from '../../../../enums/http.js';
import ProductModel from '../../../../modules/product/model.js';
import appAssert from '../../../../utils/appAssert.js';
import catchErrors from '../../../../utils/catchErrors.js';
import type { IUpdateProductReq } from './types.js';
import type express from 'express';

export default (): ((req: IUpdateProductReq, res: express.Response, next: express.NextFunction) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const { id } = req.params;
    const { name, labelColor, banner } = req.body;

    // Znajdź istniejący produkt po ID
    const product = await ProductModel.findById({ _id: id });
    appAssert(product, EHttpCodes.NOT_FOUND, 'Product not found');

    // Jeśli nazwa jest zmieniana, sprawdź, czy produkt z tą nazwą już istnieje
    if (name && name !== product.name) {
      const existingProduct = await ProductModel.exists({ name });
      appAssert(!existingProduct, EHttpCodes.CONFLICT, 'Product with this name already exists');
    }

    // Zaktualizuj nazwę i kolor etykiety
    product.name = name ?? product.name;
    product.labelColor = labelColor ?? product.labelColor;
    product.banner = banner ?? product.banner;

    await product.save();

    res.status(EHttpCodes.OK).json({ message: 'Produkt został zaktualizowany' });
  });
};
