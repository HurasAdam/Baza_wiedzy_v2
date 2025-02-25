import { getArticleHistory } from '../../../repository/index.js';
import type GetHistoryDto from './dto.js';

export default async (dto: GetHistoryDto): Promise<unknown[]> => {
  return getArticleHistory({ articleId: dto.id });
};
