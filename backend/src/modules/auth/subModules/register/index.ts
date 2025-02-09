import { createAccount } from '../../../../services/auth.service.js';
import { registerSchema } from '../../schemas.js';
import type { ICleanUser } from '../../../user/model.js';
import type express from 'express';

export default async (
  req: express.Request,
): Promise<{ user: ICleanUser; accessToken: string; refreshToken: string }> => {
  const request = registerSchema.parse({
    ...req.body,
    userAgent: req.headers['user-agent'],
  });

  return createAccount(request);
};
