import type express from 'express';
import type { ParsedQs } from 'qs';

interface IRemoveTagParams {
  id: string;
}

export type IRemoveTagReq = express.Request<Partial<IRemoveTagParams>, unknown, unknown, ParsedQs>;
