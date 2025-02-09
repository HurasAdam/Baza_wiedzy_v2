import mongoose from 'mongoose';
import Log from 'simpl-loggar';
import { EEventType } from '../../../enums/events.js';
import { EHttpCodes } from '../../../enums/http.js';
import appAssert from '../../../utils/appAssert.js';
import ArticleHistoryModel from '../models/history.js';
import ArticleModel from '../models/schema.js';
import { compareObjects } from '../shared.js';
import type { IChange, ISaveArticleChangesProps } from '../../../types/article.js';

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
  // Sprawdzenie, czy artykuł o danym ID istnieje
  const article = await ArticleModel.findById({ _id: articleId });
  appAssert(article, EHttpCodes.NOT_FOUND, 'Article not found');

  // Pobranie historii zmian artykułu z kolekcji ArticleHistory
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
