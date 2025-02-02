import type { EEventType } from '../enums/events.ts';
import type { Types } from 'mongoose';

export interface IArticle {
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
