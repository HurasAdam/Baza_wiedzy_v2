import { EHttpCodes } from '../../../../enums/http.js';
import appAssert from '../../../../utils/appAssert.js';
import SessionModel from '../../model.js';
import type RemoveSessionDto from './dto.js';

export default async (dto: RemoveSessionDto): Promise<void> => {
  const { sessionId, userId } = dto;

  const deleted = await SessionModel.findOneAndDelete({
    _id: sessionId,
    userId,
  });
  appAssert(deleted, EHttpCodes.NOT_FOUND, 'Session not found');
};

