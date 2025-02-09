import type { EEventType } from '../enums/events.ts';
import type mongoose from 'mongoose';
import type { Types } from 'mongoose';

export interface IArticleEntity {
  _id: Types.ObjectId | string;
  title: string;
  employeeDescription: string;
  clientDescription: string;
  product: Types.ObjectId;
  tags: Types.ObjectId[];
  createdBy: Types.ObjectId;
  verifiedBy: Types.ObjectId;
  viewsCounter: number;
  isTrashed: boolean;
  isVerified: boolean;
}

export interface IArticle extends mongoose.Document, IArticleEntity {
  _id: mongoose.Types.ObjectId;
}

export interface IChange {
  field: string;
  oldValue: string;
  newValue: string;
}

export interface ISaveArticleChangesProps {
  articleId: string;
  articleBeforeChanges: IArticle | null;
  updatedArticle: IArticle;
  updatedBy: string;
  eventType: EEventType;
}

export interface IArticleHistoryChanges {
  field: string;
  oldValue: string;
  newValue: string;
}

export interface IArticleHistoryEntity {
  _id: string | mongoose.Types.ObjectId;
  articleId: mongoose.Types.ObjectId;
  eventType: EEventType;
  changes: IArticleHistoryChanges[];
  updatedBy: mongoose.Types.ObjectId;
  updatedAt: Date;
}

export interface IArticleHistory extends mongoose.Document, IArticleHistoryEntity {
  _id: mongoose.Types.ObjectId;
}
