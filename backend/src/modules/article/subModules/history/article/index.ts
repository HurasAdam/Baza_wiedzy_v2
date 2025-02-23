import { getArticleHistory as getArticleHistoryService } from '../../../repository/index.js';
import type GetHistoryDto from './dto.js';

export default async (dto: GetHistoryDto): Promise<unknown[]> => {
  return getArticleHistoryService({ articleId: dto.id });
};
