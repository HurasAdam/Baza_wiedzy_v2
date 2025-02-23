import type express from 'express';
import type { ParsedQs } from 'qs';

interface IRestoreArticleParams {
  id: string;
}

export type IRestoreArticleReq = express.Request<IRestoreArticleParams, unknown, unknown, ParsedQs>;
