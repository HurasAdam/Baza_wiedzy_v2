import type { IGetStatsQuery } from '../../../../../modules/dashboard/subModules/get/stats/types.js';
import type express from 'express';
import type { ParsedQs } from 'qs';

export type IGetStatsReq = express.Request<unknown, unknown, unknown, IGetStatsQuery & ParsedQs>;
