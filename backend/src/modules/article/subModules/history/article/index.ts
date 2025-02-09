import { getArticleHistory as getArticleHistoryService } from '../../../repository/index.js';

// eslint-disable-next-line import/prefer-default-export
export const getArticleHistory = async (articleId: string): Promise<unknown[]> => {
  return getArticleHistoryService({ articleId });
};
