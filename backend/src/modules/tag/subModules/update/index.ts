import { EHttpCodes } from '../../../../enums/http.js';
import appAssert from '../../../../utils/appAssert.js';
import TagModel from '../../model.js';
import type UpdateTagDto from './dto.js';

export default async (dto: UpdateTagDto): Promise<{ message: string }> => {
  const { tagId, name } = dto;

  const tag = await TagModel.findById({ _id: tagId });
  appAssert(tag, EHttpCodes.NOT_FOUND, 'Tag not found');

  // Sprawdź, czy istnieje inny tag z taką samą nazwą
  if (name && name !== tag.name) {
    const existingTag = await TagModel.exists({ name });
    appAssert(!existingTag, EHttpCodes.CONFLICT, 'Tag already exists');
  }

  // Zaktualizuj nazwę tagu
  tag.name = name ?? tag.name;

  await tag.save();

  return { message: 'Tag has been updated' };
};
