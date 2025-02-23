import type express from 'express';
import type { ParsedQs } from 'qs';

interface ITrashArticleParams {
  id: string;
}

export type ITrashArticleReq = express.Request<ITrashArticleParams, unknown, unknown, ParsedQs>;
