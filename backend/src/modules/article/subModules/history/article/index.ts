import { getArticleHistory as getArticleHistoryRepo } from '../../../repository/index.js';
import type GetHistoryDto from './dto.js';

/**
 * Export controller, for endpoint to get article history.
 * @param dto
 */
const getArticleHistory = async (dto: GetHistoryDto): Promise<unknown[]> => {
  return getArticleHistoryRepo({ articleId: dto.id });
};

export default getArticleHistory;
