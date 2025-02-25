import { EHttpCodes } from '../../../../enums/http.js';
import appAssert from '../../../../utils/appAssert.js';
import TagRepository from '../../repository/index.js';
import type CreateTagDto from './dto.js';

export default async (dto: CreateTagDto): Promise<{ message: string }> => {
  const { name, userId } = dto;

  const tagRepo = new TagRepository();

  const tag = await tagRepo.get({ name });
  appAssert(!tag, EHttpCodes.CONFLICT, 'Tag already exists');

  await tagRepo.add({
    name,
    createdBy: userId,
  });

  // Previous code looked like this, but this should be rewritten into a entity
  // return { data: createdTag, message: 'Tag został dodany' };
  return { message: 'Tag został dodany' };
};
