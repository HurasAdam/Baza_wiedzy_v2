import { EHttpCodes } from '../../../../../enums/http.js';
import appAssert from '../../../../../utils/appAssert.js';
import ProductModel from '../../../model.js';
import type GetProductDto from './dto.js';
import type { IProduct } from '../../../model.js';

export default async (dto: GetProductDto): Promise<IProduct | null> => {
  const { productId } = dto;

  const product = await ProductModel.findById({ _id: productId });
  appAssert(product, EHttpCodes.NOT_FOUND, 'Product not found');
  return product;
};
