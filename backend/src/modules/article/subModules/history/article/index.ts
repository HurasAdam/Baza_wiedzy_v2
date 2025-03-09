import { getArticleHistory } from '../../../repository/index.js';
import type GetHistoryDto from './dto.js';

/**
 * Export controller, for endpoint to get article history.
 * @param dto
 * @returns GetArticleHistory.
 */
export default async (dto: GetHistoryDto): Promise<unknown[]> => {
  return getArticleHistory({ articleId: dto.id });
};
