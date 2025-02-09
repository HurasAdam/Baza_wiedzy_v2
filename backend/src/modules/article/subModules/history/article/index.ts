import { getArticleHistory as getArticleHistoryService } from '../../../../../services/articleHistory.service.js';

// eslint-disable-next-line import/prefer-default-export
export const getArticleHistory = async (articleId: string): Promise<unknown[]> => {
  return getArticleHistoryService({ articleId });
};
