import type express from 'express';
import type { ParsedQs } from 'qs';

interface IRemoveArticleParams {
  id: string;
}

export type IRemoveArticleReq = express.Request<IRemoveArticleParams, unknown, unknown, ParsedQs>;
