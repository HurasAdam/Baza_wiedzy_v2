import SessionModel from '../../model.js';
import type GetSessionDto from './dto.js';
import type { ISessionEntity } from '../../types.js';

/**
 * Export controller, for endpoint to get session.
 * @param dto
 */
const getSession = async (dto: GetSessionDto): Promise<ISessionEntity[]> => {
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

export default getSession;
