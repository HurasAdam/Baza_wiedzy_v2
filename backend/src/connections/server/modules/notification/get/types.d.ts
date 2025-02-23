import type express from 'express';
import type { ParsedQs } from 'qs';

export type IGetNotificationsReq = express.Request<unknown, unknown, unknown, ParsedQs>;
