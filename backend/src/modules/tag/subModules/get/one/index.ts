import TagRepository from '../../../repository/index.js';
import type GetTagDto from './dto.js';
import type { IOptional } from '../../../../../types/generic.js';
import type { ITagEntity } from '../../../types.js';

export default async (dto: GetTagDto): Promise<IOptional<ITagEntity>> => {
  const { tagId } = dto;

  const repo = new TagRepository();

  const tag = await repo.getById(tagId);
  return tag;
};
