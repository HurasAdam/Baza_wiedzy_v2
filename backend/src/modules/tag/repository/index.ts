import { EHttpCodes } from '../../../enums/http.js';
import appAssert from '../../../utils/appAssert.js';
import TagModel from '../model.js';
import type { ICreateTagParams } from '../../../types/tag.js';
import type { ITag } from '../model.js';
import type express from 'express';
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


interface GetTagsQuery {
  search?: string;
}

export const getTags = async({req}:{req:express.Request<GetTagsQuery>})=>{
  const { search = '' } = req.query;
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
    return{tags,totalCount};
}