import { EHttpCodes } from '../../../enums/http.js';
import appAssert from '../../../utils/appAssert.js';
import TagModel from '../model.js';
import type { ICreateTagParams } from '../../../types/tag.js';
import type { ITag } from '../model.js';

export const createTag = async ({ request, userId }: ICreateTagParams): Promise<{ message: string }> => {
  const { name } = request;

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

export const getTag = async (data: { tagId: string }): Promise<ITag | null> => {
  const tag = await TagModel.findById({ _id: data.tagId });
  return tag;
};
