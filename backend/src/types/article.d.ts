import type { EEventType } from '../enums/events.ts';
import type { IArticleEntity } from '../modules/article/types.js';

export interface IChange {
  field: string;
  oldValue: string;
  newValue: string;
}

export interface ISaveArticleChangesProps {
  articleId: string;
  articleBeforeChanges: IArticleEntity | null;
  updatedArticle: IArticleEntity;
  updatedBy: string;
  eventType: EEventType;
}

export interface IArticleHistoryChanges {
  field: string;
  oldValue: string;
  newValue: string;
}
