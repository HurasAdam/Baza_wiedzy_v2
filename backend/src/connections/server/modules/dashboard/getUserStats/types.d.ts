import type { IGetUserStatsQuery } from '../../../../../modules/dashboard/subModules/get/userStats/types.js';
import type express from 'express';
import type { ParsedQs } from 'qs';

export type IGetUserStatsReq = express.Request<unknown, unknown, unknown, IGetUserStatsQuery & ParsedQs>;
