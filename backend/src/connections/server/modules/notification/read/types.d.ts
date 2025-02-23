import type express from 'express';
import type { ParsedQs } from 'qs';

export interface IReadNotificationsParams {
  id: string;
}

export type IReadNotificationsReq = express.Request<IReadNotificationsParams, unknown, unknown, ParsedQs>;
