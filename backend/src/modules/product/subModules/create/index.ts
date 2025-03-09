import { EHttpCodes } from '../../../../enums/http.js';
import appAssert from '../../../../utils/appAssert.js';
import ProductRepository from '../../repository/index.js';
import type CreateProductDto from './dto.js';
import type { EBannerType } from '../../../../enums/product.js';
import type { IProductEntity } from '../../types.js';

/**
 * Export controller, for endpoint to create product.
 * @param dto
 * @returns CreateProduct.
 */
export default async (dto: CreateProductDto): Promise<IProductEntity> => {
  const { name, labelColor, userId } = dto;

  const productRepo = new ProductRepository();

  const product = await productRepo.get({ name });
  appAssert(product, EHttpCodes.CONFLICT, 'Product already exists');

  await productRepo.add({
    name,
    createdBy: userId,
    labelColor,
    banner: dto.banner as EBannerType,
  });

  return (await productRepo.getById(product[0]!._id as string)) as IProductEntity;
};
