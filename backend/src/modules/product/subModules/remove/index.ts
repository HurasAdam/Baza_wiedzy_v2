import { EHttpCodes } from '../../../../enums/http.js';
import appAssert from '../../../../utils/appAssert.js';
import ArticleRepository from '../../../article/repository/article.js';
import ConversationTopicRepository from '../../../conversationTopic/repository/index.js';
import ProductRepository from '../../repository/index.js';
import type RemoveProductDto from './dto.js';

/**
 * Export controller, for endpoint to remove product.
 * @param dto
 * @returns .
 */
export default async (dto: RemoveProductDto): Promise<{ message: string }> => {
  const { productId } = dto;

  const productRepo = new ProductRepository();
  const conversationTopicRepo = new ConversationTopicRepository();
  const articleRepo = new ArticleRepository();

  const product = await productRepo.getById(productId);
  appAssert(product, EHttpCodes.NOT_FOUND, 'Product not found');

  // Sprawdź, czy istnieją powiązane tematy rozmów
  const relatedTopicsCount = await conversationTopicRepo.count({
    product: productId,
  });

  const relatedArticlesCount = await articleRepo.count({
    product: productId,
  });

  appAssert(
    relatedTopicsCount === 0 && relatedArticlesCount === 0,
    EHttpCodes.CONFLICT,
    'Cannot delete product. It is used in one or more conversation topics or articles.',
  );

  await productRepo.remove(productId);

  return { message: 'Product deleted successfully' };
};
