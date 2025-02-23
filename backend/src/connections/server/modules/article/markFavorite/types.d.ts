import type express from 'express';
import type { ParsedQs } from 'qs';

interface IMarkFavParams {
  id: string;
}

export type IMarkFavReq = express.Request<IMarkFavParams, unknown, unknown, ParsedQs>;
