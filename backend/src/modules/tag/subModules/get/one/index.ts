import TagModel from '../../../model.js';
import type GetTagDto from './dto.js';
import type { ITag } from '../../../model.js';

export default async (dto: GetTagDto): Promise<ITag | null> => {
  const { tagId } = dto;

  const tag = await TagModel.findById({ _id: tagId });
  return tag;
};
