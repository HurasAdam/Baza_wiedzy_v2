import { EHttpCodes } from '../../../../enums/http.js';
import appAssert from '../../../../utils/appAssert.js';
import TagRepository from '../../repository/index.js';
import type UpdateTagDto from './dto.js';

/**
 * Update tag logic.
 * @param dto
 * @returns
 */
export default async (dto: UpdateTagDto): Promise<{ message: string }> => {
  const { tagId, name } = dto;

  const tagRepo = new TagRepository();

  const tag = await tagRepo.getById(tagId);
  appAssert(tag, EHttpCodes.NOT_FOUND, 'Tag not found');

  // Sprawdź, czy istnieje inny tag z taką samą nazwą
  if (name && name !== tag.name) {
    const existingTag = await tagRepo.get({ name });
    appAssert(!existingTag, EHttpCodes.CONFLICT, 'Tag already exists');
  }

  // Zaktualizuj nazwę tagu
  tag.name = name ?? tag.name;

  await tagRepo.update(tag._id as string, tag);

  return { message: 'Tag has been updated' };
};
