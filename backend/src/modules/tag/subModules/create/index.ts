import { EHttpCodes } from '../../../../enums/http.js';
import appAssert from '../../../../utils/appAssert.js';
import TagModel from '../../model.js';
import type CreateTagDto from './dto.js';

export default async (dto: CreateTagDto): Promise<{ message: string }> => {
  const { name, userId } = dto;

  const tag = await TagModel.exists({ name });
  appAssert(!tag, EHttpCodes.CONFLICT, 'Tag already exists');

  await TagModel.create({
    name,
    createdBy: userId,
  });

  // Previous code looked like this, but this should be rewritten into a entity
  // return { data: createdTag, message: 'Tag został dodany' };
  return { message: 'Tag został dodany' };
};
