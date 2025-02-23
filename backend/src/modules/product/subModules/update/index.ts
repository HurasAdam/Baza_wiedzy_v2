import { EHttpCodes } from '../../../../enums/http.js';
import appAssert from '../../../../utils/appAssert.js';
import ProductModel from '../../model.js';
import type UpdateProductDto from './dto.js';

export default async (dto: UpdateProductDto): Promise<void> => {
  const { name, labelColor, banner, productId } = dto;

  // Znajdź istniejący produkt po ID
  const product = await ProductModel.findById({ _id: productId });
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
};
