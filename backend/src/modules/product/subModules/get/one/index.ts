import { EHttpCodes } from '../../../../../enums/http.js';
import appAssert from '../../../../../utils/appAssert.js';
import ProductRepository from '../../../repository/index.js';
import type GetProductDto from './dto.js';
import type { IProductEntity } from '../../../types.js';

/**
 * Export controller, for endpoint to get one product.
 * @param dto
 */
const getOneProduct = async (dto: GetProductDto): Promise<IProductEntity | null> => {
  const { productId } = dto;

  const productRepo = new ProductRepository();

  const product = await productRepo.getById(productId);
  appAssert(product, EHttpCodes.NOT_FOUND, 'Product not found');
  return product;
};

export default getOneProduct;
