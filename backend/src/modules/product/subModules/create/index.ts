import { EHttpCodes } from '../../../../enums/http.js';
import appAssert from '../../../../utils/appAssert.js';
import ProductModel from '../../model.js';
import type CreateProductDto from './dto.js';
import type { IProduct } from '../../model.js';

export default async (dto: CreateProductDto): Promise<IProduct> => {
  const { name, labelColor, userId } = dto;

  const product = await ProductModel.exists({ name });
  appAssert(!product, EHttpCodes.CONFLICT, 'Product already exists');

  return ProductModel.create({
    name,
    createdBy: userId,
    labelColor,
    banner: dto.banner,
  });
};
