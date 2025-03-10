import { EHttpCodes } from '../../../../enums/http.js';
import appAssert from '../../../../utils/appAssert.js';
import ProductRepository from '../../repository/index.js';
import type UpdateProductDto from './dto.js';

/**
 * Export controller, for endpoint to update product.
 * @param dto
 */
const updateProduct = async (dto: UpdateProductDto): Promise<void> => {
  const { name, labelColor, banner, productId } = dto;

  const productRepo = new ProductRepository();

  // Znajdź istniejący produkt po ID
  const product = await productRepo.getById(productId);
  appAssert(product, EHttpCodes.NOT_FOUND, 'Product not found');

  // Jeśli nazwa jest zmieniana, sprawdź, czy produkt z tą nazwą już istnieje
  if (name && name !== product.name) {
    const existingProduct = await productRepo.get({ name });
    appAssert(!existingProduct, EHttpCodes.CONFLICT, 'Product with this name already exists');
  }

  // Zaktualizuj nazwę i kolor etykiety
  product.name = name ?? product.name;
  product.labelColor = labelColor ?? product.labelColor;
  product.banner = banner ?? product.banner;

  await productRepo.update(product._id as string, product);
};

export default updateProduct;
