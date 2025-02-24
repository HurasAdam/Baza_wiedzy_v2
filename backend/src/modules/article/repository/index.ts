import mongoose from 'mongoose';
import Log from 'simpl-loggar';
import { EEventType } from '../../../enums/events.js';
import { EHttpCodes } from '../../../enums/http.js';
import appAssert from '../../../utils/appAssert.js';
import ArticleHistoryModel from '../models/history.js';
import ArticleModel from '../models/schema.js';
import { compareObjects } from '../shared.js';
import type { IChange, ISaveArticleChangesProps } from '../../../types/article.js';
import type { IArticleEntity, IArticleHistoryEntity, ICreateArticle, ICreateArticleHistory } from '../types.js';
import type { FilterQuery } from 'mongoose';

export const getSchema = async (data: FilterQuery<Partial<IArticleEntity>>): Promise<IArticleEntity[]> => {
  return ArticleModel.find(data).lean();
};

export const getHistory = async (
  data: FilterQuery<Partial<IArticleHistoryEntity>>,
): Promise<IArticleHistoryEntity[]> => {
  return ArticleHistoryModel.find(data).lean();
};

export const getOneSchemaById = async (_id: string): Promise<IArticleEntity | null> => {
  return ArticleModel.findOne({ _id }).lean();
};

export const getOneHistoryById = async (_id: string): Promise<IArticleHistoryEntity | null> => {
  return ArticleHistoryModel.findOne({ _id }).lean();
};

export const removeOneSchema = async (_id: string): Promise<void> => {
  await ArticleModel.findOneAndDelete({ _id });
};

export const removeOneHistory = async (_id: string): Promise<void> => {
  await ArticleHistoryModel.findOneAndDelete({ _id });
};

export const updateOneSchema = async (_id: string, newElement: Partial<IArticleEntity>): Promise<void> => {
  await ArticleModel.findOneAndUpdate({ _id }, newElement);
};

export const updateOneHistory = async (_id: string, newElement: Partial<IArticleHistoryEntity>): Promise<void> => {
  await ArticleHistoryModel.findOneAndUpdate({ _id }, newElement);
};

export const createNewSchema = async (data: ICreateArticle): Promise<string> => {
  Log.debug('Article repo', 'Creating new article', data);
  const model = new ArticleModel(data);
  return (await model.save())._id.toString();
};

export const createNewHistory = async (data: ICreateArticleHistory): Promise<string> => {
  const model = new ArticleHistoryModel(data);
  return (await model.save())._id.toString();
};

export const getFavoriteArticles = async (ids: string[], skip: number, page: number): Promise<IArticleEntity[]> => {
  return ArticleModel.find({
    _id: { $in: ids },
  })
    .select([
      '-clientDescription',
      '-employeeDescription',
      '-createdBy',
      '-verifiedBy',
      '-createdAt',
      '-viewsCounter',
      '-__v',
    ])
    .populate([{ path: 'tags', select: ['name'] }])
    .skip(skip)
    .limit(page);
};

export const saveArticleChanges = async ({
  articleId,
  articleBeforeChanges,
  updatedArticle,
  updatedBy,
  eventType,
}: ISaveArticleChangesProps): Promise<void> => {
  let changes: IChange[] = [];

  // Porównaj artykuły, jeżeli zmiany zachodzą (np. zaktualizowany artykuł)
  if (eventType === EEventType.Updated && articleBeforeChanges) {
    changes = compareObjects(
      articleBeforeChanges as unknown as Record<string, unknown>,
      updatedArticle as unknown as Record<string, unknown>,
    );

    // Jeśli zmiany obejmują tagi, sprawdź, czy wszystkie tagi istnieją

    // Jeżeli nie wykryto zmian, nic nie zapisujemy
    if (changes.length === 0) return;
  }

  Log.debug('Article history', 'Before changes', articleBeforeChanges, 'Updated', updatedArticle);

  // Zapisujemy historię zmian
  const historyEntry = new ArticleHistoryModel({
    articleId,
    changes,
    updatedBy,
    eventType,
  });
  await historyEntry.save();
};

export const getArticleHistory = async ({ articleId }: { articleId: string }) => {
  const article = await getOneSchema(articleId);

  appAssert(article, EHttpCodes.NOT_FOUND, 'Article not found');

  // Get article id and find all of its history
  const articleHistory = await ArticleHistoryModel.aggregate([
    {
      $match: { articleId: new mongoose.Types.ObjectId(articleId) }, // Filtruj po articleId
    },
    {
      $lookup: {
        from: 'users', // Kolekcja Users, zakładając, że "updatedBy" jest referencją do Usera
        localField: 'updatedBy',
        foreignField: '_id',
        as: 'updatedBy',
      },
    },
    {
      $unwind: '$updatedBy', // Rozwijanie tablicy "updatedBy"
    },
    {
      $lookup: {
        from: 'articles', // Kolekcja Articles
        localField: 'articleId',
        foreignField: '_id',
        as: 'articleDetails',
      },
    },
    {
      $addFields: {
        articleDetails: {
          $cond: {
            if: { $eq: ['$eventType', 'created'] }, // Warunek, jeśli eventType to "created"
            then: { $arrayElemAt: ['$articleDetails', 0] }, // Pobierz pierwszy element z tablicy
            else: null, // Dla innych eventType, nie dodawaj danych artykułu
          },
        },
      },
    },
    {
      $project: {
        _id: 1,
        articleId: 1,
        eventType: 1,
        changes: 1,
        updatedBy: { name: 1, surname: 1 },
        updatedAt: 1,
        createdAt: 1,
        articleDetails: 1, // Zwróć artykuł tylko dla "created"
      },
    },
  ]);

  return articleHistory;
};
