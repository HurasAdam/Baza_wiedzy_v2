import { EHttpCodes } from '../../../../enums/http.js';
import appAssert from '../../../../utils/appAssert.js';
import ArticleModel from '../../../article/models/schema.js';
import ConversationTopicModel from '../../../conversationTopic/model.js';
import ProductModel from '../../model.js';
import type RemoveProductDto from './dto.js';

export default async (dto: RemoveProductDto): Promise<{ message: string }> => {
  const { productId } = dto;

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
