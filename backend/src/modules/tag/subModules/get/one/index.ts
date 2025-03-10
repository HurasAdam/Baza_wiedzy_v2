import TagRepository from '../../../repository/index.js';
import type GetTagDto from './dto.js';
import type { IOptional } from '../../../../../types/generic.js';
import type { ITagEntity } from '../../../types.js';

/**
 * Export controller, for endpoint to get one tag.
 * @param dto
 */
const getOneTag = async (dto: GetTagDto): Promise<IOptional<ITagEntity>> => {
  const { tagId } = dto;

  const repo = new TagRepository();

  const tag = await repo.getById(tagId);
  return tag;
};

export default getOneTag;
