import type { EEventType } from '../../enums/events.ts';
import type { IArticleHistoryChanges } from '../../types/article.js';
import type mongoose from 'mongoose';

export interface ICreateArticle {
  title: string;
  employeeDescription: string;
  clientDescription: string;
  product: mongoose.Types.ObjectId;
  tags: mongoose.Types.ObjectId[];
  createdBy: mongoose.Types.ObjectId;
  verifiedBy: mongoose.Types.ObjectId;
}

export interface IArticleEntity extends ICreateArticle {
  _id: mongoose.Types.ObjectId | string;
  viewsCounter: number;
  isTrashed: boolean;
  isVerified: boolean;
}

export interface IArticle extends mongoose.Document, IArticleEntity {
  _id: mongoose.Types.ObjectId;
}

export interface ICreateArticleHistory {
  articleId: mongoose.Types.ObjectId;
  eventType: EEventType;
  changes: IArticleHistoryChanges[];
  updatedBy: mongoose.Types.ObjectId;
}

export interface IArticleHistoryEntity extends ICreateArticleHistory {
  _id: string | mongoose.Types.ObjectId;
  updatedAt: Date;
}

export interface IArticleHistory extends mongoose.Document, IArticleHistoryEntity {
  _id: mongoose.Types.ObjectId;
}
