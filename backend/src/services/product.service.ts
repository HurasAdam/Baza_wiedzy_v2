import { EHttpCodes } from '../enums/http.js';
import ArticleModel from '../models/article.model.js';
import ConversationTopicModel from '../models/conversationTopic.model.js';
import ProductModel from '../models/product.model.js';
import appAssert from '../utils/appAssert.js';
import type { IProduct } from '../models/product.model.js';
import type { ICreateProductParams } from '../types/products.js';

export const createProduct = async ({ request, userId }: ICreateProductParams): Promise<IProduct> => {
  const { name, labelColor, banner } = request;

  const product = await ProductModel.exists({ name });
  appAssert(!product, EHttpCodes.CONFLICT, 'Product already exists');

  const createdProduct = await ProductModel.create({
    name,
    createdBy: userId,
    labelColor,
    banner,
  });
  return createdProduct;
};

export const deleteProduct = async ({ productId }: { productId: string }): Promise<{ message: string }> => {
  // Znajdź produkt w bazie
  const product = await ProductModel.findById({ _id: productId });
  appAssert(product, EHttpCodes.NOT_FOUND, 'Product not found');

  // Sprawdź, czy istnieją powiązane tematy rozmów
  const relatedTopicsCount = await ConversationTopicModel.countDocuments({
    product: productId,
  });

  const relatedArticlesCount = await ArticleModel.countDocuments({
    product: productId,
  });

  appAssert(
    relatedTopicsCount === 0 && relatedArticlesCount === 0,
    EHttpCodes.CONFLICT,
    'Cannot delete product. It is used in one or more conversation topics or articles.',
  );

  // Usuń produkt, jeśli brak powiązań
  await ProductModel.findByIdAndDelete({ _id: productId });

  return { message: 'Product deleted successfully' };
};

export const getSingleProduct = async ({ productId }: { productId: string }): Promise<IProduct> => {
  const product = await ProductModel.findById({ _id: productId });
  appAssert(product, EHttpCodes.NOT_FOUND, 'Product not found');
  return product;
};
