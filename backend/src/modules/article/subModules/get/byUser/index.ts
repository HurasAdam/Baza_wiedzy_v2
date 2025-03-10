import { EHttpCodes } from '../../../../../enums/http.js';
import appAssert from '../../../../../utils/appAssert.js';
import ArticleModel from '../../../models/schema.js';
import ArticleRepository from '../../../repository/article.js';
import type GetArticleByUserDto from './dto.js';
import type { IArticleEntity } from '../../../types.js';

/**
 * Export controller, for endpoint to get articles by user.
 * @param data
 */
const getArticleByUser = async (
  data: GetArticleByUserDto,
): Promise<{ data: IArticleEntity[]; pagination: { page: number; pages: number; total: number } }> => {
  const { id: userId, startDate, endDate } = data;

  const repo = new ArticleRepository();

  appAssert(userId, EHttpCodes.CONFLICT, 'User not found');

  const query: {
    createdBy: string;
    isTrashed: boolean;
    createdAt?: {
      $gte?: Date;
      $lte?: Date;
    };
  } = {
    createdBy: userId,
    isTrashed: false,
  };

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) {
      query.createdAt.$gte = new Date(startDate.toString()); // Data większa lub równa
    }
    if (endDate) {
      query.createdAt.$lte = new Date(endDate.toString()); // Data mniejsza lub równa
    }
  }

  const total = await repo.count(query);
  const limit = parseInt(data.limit ?? '20');
  const pageSize = limit;
  const pageNumber = parseInt(data.page ?? '1');
  const skip = (pageNumber - 1) * pageSize;

  const result = await ArticleModel.find(query)
    .select(['title', 'createdAt', 'isVerified'])
    .skip(skip)
    .limit(pageSize)
    .sort({ createdAt: -1 });

  const responseObject = {
    data: result,
    pagination: {
      total,
      page: pageNumber,
      pages: Math.ceil(total / pageSize),
    },
  };

  return responseObject;
};

export default getArticleByUser;
