import TagModel from '../../../model.js';
import type GetManyTagsDto from './dto.js';
import type { ITagEntity } from '../../../types.js';

/**
 * Export controller, for endpoint to get many tags.
 * @param dto
 */
const getManyTags = async (dto: GetManyTagsDto): Promise<{ tags: ITagEntity[]; totalCount: number }> => {
  const { search } = dto;

  // Filtr do wyszukiwania tagów
  const filter = {
    isDefault: false,
    ...(search && { name: { $regex: search, $options: 'i' } }),
  };

  // Agregacja
  const tags = await TagModel.aggregate([
    { $match: filter },
    {
      $lookup: {
        from: 'articles',
        localField: '_id',
        foreignField: 'tags',
        as: 'articleLinks',
      },
    },
    {
      $addFields: {
        isUsed: { $gt: [{ $size: '$articleLinks' }, 0] },
      },
    },
    { $unset: 'articleLinks' },
  ]);

  // Liczba wszystkich pasujących tagów
  const totalCount = await TagModel.countDocuments(filter);
  return { tags: tags as ITagEntity[], totalCount };
};

export default getManyTags;
