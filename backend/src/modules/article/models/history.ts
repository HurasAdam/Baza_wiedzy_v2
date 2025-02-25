import mongoose from 'mongoose';
import { EEventType } from '../../../enums/events.js';
import type { IArticleHistory } from '../types.js';

export const changesSchema = new mongoose.Schema({
  field: {
    type: String,
    required: [true, 'Changes - field not provided'],
  },
  oldValue: {
    type: String,
    required: [true, 'Changes - oldvalue not provided'],
  },
  newValue: {
    type: String,
    required: [true, 'Changes - newValue not provided'],
  },
});

const articleHistorySchema = new mongoose.Schema(
  {
    articleId: {
      type: mongoose.Types.ObjectId,
      ref: 'Article',
      required: true,
    },
    eventType: {
      type: String,
      required: true,
      enum: Object.values(EEventType),
    },
    changes: [
      {
        type: changesSchema,
        required: [true, 'Changes not provided'],
      },
    ],
    updatedBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

const ArticleHistoryModel = mongoose.model<IArticleHistory>('ArticleHistory', articleHistorySchema);
export default ArticleHistoryModel;
