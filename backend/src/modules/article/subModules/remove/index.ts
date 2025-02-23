import { EHttpCodes } from '../../../../enums/http.js';
import appAssert from '../../../../utils/appAssert.js';
import ArticleHistoryModel from '../../models/history.js';
import ArticleModel from '../../models/schema.js';
import type RemoveArticleDto from './dto.js';

export default async (dto: RemoveArticleDto): Promise<void> => {
  const { id } = dto;

  // Znalezienie artykułu
  const article = await ArticleModel.findById({ _id: id });
  appAssert(article, EHttpCodes.NOT_FOUND, 'Article not found');

  // Usunięcie artykułu
  const deletedArticle = await ArticleModel.findByIdAndDelete({ _id: id });
  appAssert(deletedArticle, EHttpCodes.INTERNAL_SERVER_ERROR, 'Something went wrong');

  // Usunięcie powiązanej historii
  await ArticleHistoryModel.deleteMany({ articleId: id });
};
