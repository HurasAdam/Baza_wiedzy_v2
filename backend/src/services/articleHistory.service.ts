import { Types } from "mongoose";
import ArticleHistoryModel from "../models/ArticleHistory.model";

interface Article {
  _id: Types.ObjectId; // Używamy ObjectId zamiast string
  title: string;
  employeeDescription: string;
  clientDescription: string;
  tags: Types.ObjectId[]; // Używamy ObjectId dla tagów
  createdBy: Types.ObjectId;
  verifiedBy: Types.ObjectId;
  viewsCounter: number;
  isTrashed: boolean;
  isVerified: boolean;
  // Dodaj inne pola, które są w Twoim modelu
}

interface Change {
  field: string;
  oldValue: string;
  newValue: string;
}

interface ISaveArticleChangesProps {
  articleId: string;
  articleBeforeChanges: Article; // Określamy typ przed zmianami
  updatedArticle: Article; // Określamy typ po zmianach
  updatedBy: string;
}

export const saveArticleChanges = async ({
  articleId,
  articleBeforeChanges,
  updatedArticle,
  updatedBy,
}: ISaveArticleChangesProps): Promise<void> => {
  const changes = compareArticles(articleBeforeChanges, updatedArticle);

  console.log(changes);

  if (changes.length === 0) {
    return;
  }
  const historyEntry = new ArticleHistoryModel({
    articleId: articleId,
    changes,
    updatedBy: updatedBy,
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
