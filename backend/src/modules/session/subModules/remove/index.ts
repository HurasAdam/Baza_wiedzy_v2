import { EHttpCodes } from '../../../../enums/http.js';
import appAssert from '../../../../utils/appAssert.js';
import SessionRepository from '../../repository/index.js';
import type RemoveSessionDto from './dto.js';

/**
 * Export controller, for endpoint to remove session.
 * @param dto
 * @returns RemoveSession.
 */
export default async (dto: RemoveSessionDto): Promise<void> => {
  const { sessionId, userId } = dto;

  const repo = new SessionRepository();

  const deleted = await repo.removeMany({
    _id: sessionId,
    userId,
  });
  appAssert(deleted, EHttpCodes.NOT_FOUND, 'Session not found');
};
