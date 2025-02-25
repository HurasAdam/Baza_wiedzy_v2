// eslint-disable-next-line max-classes-per-file
import type { IArticleEntity, IArticleHistoryEntity, ICreateArticle, ICreateArticleHistory } from './types.js';
import type { EEventType } from '../../enums/events.js';
import type { IArticleHistoryChanges } from '../../types/article.js';
import type mongoose from 'mongoose';

export class ArticleEntity implements IArticleEntity {
  readonly _id: mongoose.Types.ObjectId | string;
  readonly title: string;
  readonly employeeDescription: string;
  readonly clientDescription: string;
  readonly product: mongoose.Types.ObjectId;
  readonly tags: mongoose.Types.ObjectId[];
  readonly createdBy: mongoose.Types.ObjectId;
  readonly verifiedBy: mongoose.Types.ObjectId;
  readonly viewsCounter: number;
  readonly isTrashed: boolean;
  readonly isVerified: boolean;

  constructor(data: IArticleEntity | ICreateArticle) {
    this._id = (data as IArticleEntity)._id as string;
    this.title = data.title;
    this.employeeDescription = data.employeeDescription;
    this.clientDescription = data.clientDescription;
    this.product = data.product;
    this.tags = data.tags;
    this.createdBy = data.createdBy;
    this.verifiedBy = data.verifiedBy;

    this.viewsCounter = (data as IArticleEntity).viewsCounter ?? 0;
    this.isTrashed = (data as IArticleEntity).isTrashed ?? false;
    this.isVerified = (data as IArticleEntity).isVerified ?? false;
  }
}

export class ArticleHistoryEntity implements IArticleHistoryEntity {
  readonly _id: string | mongoose.Types.ObjectId;
  readonly articleId: mongoose.Types.ObjectId;
  readonly eventType: EEventType;
  readonly changes: IArticleHistoryChanges[];
  readonly updatedBy: mongoose.Types.ObjectId;
  readonly updatedAt: Date;

  constructor(data: IArticleHistoryEntity | ICreateArticleHistory) {
    this._id = (data as IArticleHistoryEntity)._id;
    this.articleId = data.articleId;
    this.eventType = data.eventType;
    this.changes = data.changes;
    this.updatedBy = data.updatedBy;
    this.updatedAt = (data as IArticleHistoryEntity).updatedAt;
  }
}
