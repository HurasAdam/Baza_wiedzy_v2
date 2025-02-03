import { EHttpCodes } from '../../../enums/http.js';
import ProductModel from '../../../modules/product/model.js';
import { newProductSchema } from '../../../modules/product/schema.js';
import { createProduct, deleteProduct, getSingleProduct } from '../../../services/product.service.js';
import appAssert from '../../../utils/appAssert.js';
import catchErrors from '../../../utils/catchErrors.js';

export const createProductHandler = catchErrors(async (req, res) => {
  const request = newProductSchema.parse(req.body);
  const { userId } = req;
  const newProduct = await createProduct({ request, userId });

  return res.status(EHttpCodes.OK).json(newProduct);
});

export const deleteProductHandler = catchErrors(async (req, res) => {
  const { id } = req.params;

  const conversationTproduct = await deleteProduct({ productId: id as string });
  return res.status(EHttpCodes.OK).json(conversationTproduct);
});

export const getProductsHandler = catchErrors(async (_req, res) => {
  const tags = await ProductModel.find({}).select(['-createdBy']);
  return res.status(EHttpCodes.OK).json(tags);
});

export const getSingleProductHandler = catchErrors(async (req, res) => {
  const { id } = req.params;
  const product = await getSingleProduct({ productId: id as string });
  return res.status(EHttpCodes.OK).json(product);
});

export const updateProductHandler = catchErrors(async (req, res) => {
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
  product.name = name || product.name;
  product.labelColor = labelColor || product.labelColor;
  product.banner = banner || product.banner;

  await product.save();

  res.status(EHttpCodes.OK).json({ message: 'Produkt został zaktualizowany' });
});
