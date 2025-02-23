import type { ICreateTagDto } from '../../../../../modules/tag/subModules/create/types.js';
import type express from 'express';
import type { ParsedQs } from 'qs';

export type ICreateTagReq = express.Request<unknown, unknown, ICreateTagDto, ParsedQs>;
