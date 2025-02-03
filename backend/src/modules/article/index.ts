import ArticleModel from './schema.model.js';
import { EHttpCodes } from '../../enums/http.js';
import appAssert from '../../utils/appAssert.js';
import UserModel from '../user/model.js';
import type { IArticle } from '../../types/article.js';

interface ICreateArticleRequest {
  title: string;
  employeeDescription: string;
  tags: string[];
  clientDescription: string;
  product: string;
}

interface IGetArticleParams {
  userId: string;
  articleId: string;
}

interface ICreateArticleParams {
  request: ICreateArticleRequest;
  userId: string; // Zakładam, że userId to string
}

export const createArticle = async ({ request, userId }: ICreateArticleParams): Promise<IArticle> => {
  const { title, employeeDescription, tags, clientDescription, product } = request;

  const article = await ArticleModel.exists({ title });
  appAssert(!article, EHttpCodes.CONFLICT, 'Article already exists');

  const createdArticle = await ArticleModel.create({
    title,
    employeeDescription,
    clientDescription,
    tags,
    product,
    createdBy: userId,
    verifiedBy: userId,
  });
  return createdArticle;
};

export const incrementArticleViews = async ({ articleId }: { articleId: string }): Promise<{ status: EHttpCodes }> => {
  const article = await ArticleModel.findById(articleId);
  appAssert(article, EHttpCodes.CONFLICT, 'Article already exists');

  article.viewsCounter = article.viewsCounter + 1;
  await article.save();
  return { status: EHttpCodes.OK };
};

export const getArticle = async ({ userId, articleId }: IGetArticleParams) => {
  const user = await UserModel.findById(userId);
  const article = await ArticleModel.findById({ _id: articleId }).populate([
    { path: 'tags', select: ['name'] },
    { path: 'createdBy', select: ['name', 'surname'] },
    { path: 'verifiedBy', select: ['name', 'surname'] },
    { path: 'product', select: ['name', 'labelColor', 'banner'] },
  ]);

  appAssert(article, EHttpCodes.CONFLICT, 'Article not found');
  appAssert(user, EHttpCodes.CONFLICT, 'User not found');

  const isFavorite = user?.favourites.includes(article._id);

  const articleObj = {
    ...article.toObject(),
    isFavourite: isFavorite || false,
  };

  return articleObj;
};

// ARTICLES

// interface GetArticlesOptions {
//     title?: string;
//     tags?: string[];
//     author?: string;
//     verified?: boolean;
//     limit: number;
//     page: number;
//     sortBy: string;
//   }

//   export const getAllArticles = async ({options,req}:{options:GetArticlesOptions,req:Express.Request} ) => {
//     const { title, tags, author, verified, limit, page, sortBy } = options;

//     const query: any = {};

//     // Konstruowanie zapytania
//     if (title) {
//       query.title = new RegExp(title, "i");
//     }

//     if (tags) {
//       query.tags = { $all: tags };
//     }

//     if (author) {
//       query.createdBy = author;
//     }

//     if (verified !== undefined) {
//       query.isVerified = verified;
//     }

//     const pageSize = limit;
//     const skipp = (page - 1) * pageSize;

//     const articles = await ArticleModel.find(query)
//       .select([
//         "-clientDescription",
//         "-employeeDescription",
//         "-verifiedBy",
//         "-updatedAt",
//         "-viewsCounter",
//         "-__v",
//       ])
//       .populate([
//         { path: "tags", select: ["name", "shortname"] },
//         { path: "createdBy", select: ["name", "surname"] },
//       ])
//       .skip(skipp)
//       .limit(pageSize)
//       .sort(sortBy);

//     const total = await ArticleModel.countDocuments(query);

//     return {
//       articles,
//       total,
//       pages: Math.ceil(total / pageSize),
//       currentPage: page,
//     };
//   };
