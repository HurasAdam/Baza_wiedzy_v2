import { EHttpCodes } from '../../../../../enums/http.js';
import appAssert from '../../../../../utils/appAssert.js';
import ArticleModel from '../../../models/schema.js';
import type GetArticleByUserDto from './dto.js';
import type { IArticleEntity } from '../../../../../types/article.js';

export default async (
  data: GetArticleByUserDto,
): Promise<{ data: IArticleEntity[]; pagination: { page: number; pages: number; total: number } }> => {
  const { id: userId, startDate, endDate } = data;

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

  const total = await ArticleModel.countDocuments(query);
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
