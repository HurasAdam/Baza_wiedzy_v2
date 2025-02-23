import type express from 'express';
import type { ParsedQs } from 'qs';

interface IRemoveSessionParams {
  id: string;
}

export type IRemoveSessionReq = express.Request<IRemoveSessionParams, unknown, unknown, ParsedQs>;
