import type { EEventType } from '../enums/events.ts';
import type { IArticle, ICreateArticle } from '../modules/article/types.js';

export interface IChange {
  field: string;
  oldValue: string;
  newValue: string;
}

export interface ISaveArticleChangesProps {
  articleId: string;
  articleBeforeChanges: IArticle | null;
  updatedArticle: ICreateArticle;
  updatedBy: string;
  eventType: EEventType;
}

export interface IArticleHistoryChanges {
  field: string;
  oldValue: string;
  newValue: string;
}
