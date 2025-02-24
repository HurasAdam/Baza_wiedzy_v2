import TagModel from '../../../model.js';
import type GetManyTagsDto from './dto.js';
import type { ITagEntity } from '../../../model.js';

export default async (dto: GetManyTagsDto): Promise<{ tags: ITagEntity[]; totalCount: number }> => {
  const { search } = dto;

  // Filtr do wyszukiwania tagów
  const filter = {
    isDefault: false,
    ...(search && { name: { $regex: search, $options: 'i' } }), // Wyszukiwanie w nazwach tagów
  };

  // Agregacja
  const tags = await TagModel.aggregate([
    { $match: filter }, // Filtruj tagi
    {
      $lookup: {
        from: 'articles', // Kolekcja, z którą łączymy (nazwa w MongoDB)
        localField: '_id', // Pole z `TagModel`, które łączymy
        foreignField: 'tags', // Pole z `ArticleModel`, które łączymy
        as: 'articleLinks', // Nazwa wynikowej tablicy
      },
    },
    {
      $addFields: {
        isUsed: { $gt: [{ $size: '$articleLinks' }, 0] }, // Dodaj pole `isUsed` (true, jeśli powiązania istnieją)
      },
    },
    { $unset: 'articleLinks' }, // Usuń tymczasową tablicę `articleLinks` (opcjonalne)
  ]);

  // Liczba wszystkich pasujących tagów
  const totalCount = await TagModel.countDocuments(filter);
  return { tags, totalCount };
};
