import SessionModel from '../../model.js';
import type GetSessionDto from './dto.js';
import type { ISessionDocument } from '../../model.js';

export default async (dto: GetSessionDto): Promise<ISessionDocument[]> => {
  return SessionModel.find(
    {
      userId: dto.userId,
      expiresAt: { $gt: Date.now() },
    },
    {
      _id: 1,
      userAgent: 1,
      createdAt: 1,
    },
    {
      sort: { createdAt: -1 },
    },
  );
};
