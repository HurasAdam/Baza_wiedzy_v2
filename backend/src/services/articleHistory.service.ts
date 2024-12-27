import mongoose, { Types } from "mongoose";
import ArticleHistoryModel from "../models/ArticleHistory.model";
import ArticleModel from "../models/Article.model";
import appAssert from "../utils/appAssert";
import { NOT_FOUND } from "../constants/http";
import EventType from "../constants/articleEventTypes";

interface Article {
  _id: Types.ObjectId;
  title: string;
  employeeDescription: string;
  clientDescription: string;
  tags: Types.ObjectId[];
  createdBy: Types.ObjectId;
  verifiedBy: Types.ObjectId;
  viewsCounter: number;
  isTrashed: boolean;
  isVerified: boolean;
}

interface Change {
  field: string;
  oldValue: string;
  newValue: string;
}

interface ISaveArticleChangesProps {
  articleId: string;
  articleBeforeChanges: Article | null;
  updatedArticle: Article;
  updatedBy: string;
  eventType: EventType;
}

export const getArticleHistory = async ({
  articleId,
}: {
  articleId: string;
}) => {
  // Sprawdzenie, czy artykuł o danym ID istnieje
  const article = await ArticleModel.findById({ _id: articleId });
  appAssert(article, NOT_FOUND, "Article not found");

  // Pobranie historii zmian artykułu z kolekcji ArticleHistory
  const articleHistory = await ArticleHistoryModel.aggregate([
    {
      $match: { articleId: new mongoose.Types.ObjectId(articleId) }, // Filtruj po articleId
    },
    {
      $lookup: {
        from: "users", // Kolekcja Users, zakładając, że "updatedBy" jest referencją do Usera
        localField: "updatedBy",
        foreignField: "_id",
        as: "updatedBy",
      },
    },
    {
      $unwind: "$updatedBy", // Rozwijanie tablicy "updatedBy"
    },
    {
      $lookup: {
        from: "articles", // Kolekcja Articles
        localField: "articleId",
        foreignField: "_id",
        as: "articleDetails",
      },
    },
    {
      $addFields: {
        articleDetails: {
          $cond: {
            if: { $eq: ["$eventType", "created"] }, // Warunek, jeśli eventType to "created"
            then: { $arrayElemAt: ["$articleDetails", 0] }, // Pobierz pierwszy element z tablicy
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

export const saveArticleChanges = async ({
  articleId,
  articleBeforeChanges,
  updatedArticle,
  updatedBy,
  eventType,
}: ISaveArticleChangesProps): Promise<void> => {
  let changes: Change[] = [];
  if (eventType === EventType.Updated && articleBeforeChanges) {
    changes = compareArticles(articleBeforeChanges, updatedArticle);
    if (changes.length === 0) return;
  }
  const historyEntry = new ArticleHistoryModel({
    articleId: articleId,
    changes,
    updatedBy: updatedBy,
    eventType,
  });
  await historyEntry.save();
};

const compareArticles = (
  articleBeforeChanges: Article,
  updatedArticle: Article
) => {
  const changes: Change[] = [];

  // Porównanie tytułu
  if (updatedArticle.title !== articleBeforeChanges.title) {
    changes.push({
      field: "title",
      oldValue: articleBeforeChanges.title,
      newValue: updatedArticle.title,
    });
  }

  // Porównanie opisu klienta
  if (
    updatedArticle.clientDescription !== articleBeforeChanges.clientDescription
  ) {
    changes.push({
      field: "clientDescription",
      oldValue: articleBeforeChanges.clientDescription,
      newValue: updatedArticle.clientDescription,
    });
  }

  // Porównanie opisu pracownika
  if (
    updatedArticle.employeeDescription !==
    articleBeforeChanges.employeeDescription
  ) {
    changes.push({
      field: "employeeDescription",
      oldValue: articleBeforeChanges.employeeDescription,
      newValue: updatedArticle.employeeDescription,
    });
  }

  // Porównanie tagów
  if (
    JSON.stringify(updatedArticle.tags) !==
    JSON.stringify(articleBeforeChanges.tags)
  ) {
    changes.push({
      field: "tags",
      oldValue: JSON.stringify(articleBeforeChanges.tags),
      newValue: JSON.stringify(updatedArticle.tags),
    });
  }

  return changes;
};
