import { EHttpCodes } from '../../../enums/http.js';
import appAssert from '../../../utils/appAssert.js';
import TagModel from '../../tag/model.js';
import type { GetTagsQuery, GetTagsResponse, ICreateTagParams, IUpdateTagParams } from '../../../types/tag.js';
import type { ITag } from '../model.js';
import type express from 'express';
import ArticleModel from '../../article/models/schema.js';
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


export const getTags = async({req}:{req:express.Request<GetTagsQuery>}):Promise<GetTagsResponse>=>{
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




export const updateTag = async({request,tagId}:IUpdateTagParams):Promise<{message:string}>=>{
  const tag = await TagModel.findById({ _id: tagId });
    appAssert(tag, EHttpCodes.NOT_FOUND, 'Tag not found');
    const { name } = request;
    // Sprawdź, czy istnieje inny tag z taką samą nazwą
    if (name && name !== tag.name) {
      const existingTag = await TagModel.exists({ name });
      appAssert(!existingTag, EHttpCodes.CONFLICT, 'Tag already exists');
    }

    // Zaktualizuj nazwę tagu
    tag.name = name ?? tag.name;

    await tag.save();

  
    return { message: 'Tag has been updated' };
   
}


export const deleteTag = async({req}:{req:express.Request}):Promise<{message:string}>=>{
  const { id } = req.params;
   // Znajdź tag, który próbujesz usunąć
   const tag = await TagModel.findById(id);
   appAssert(tag, EHttpCodes.NOT_FOUND, 'Tag not found');

   // Znajdź artykuły, które mają ten tag
   const articlesWithTag = await ArticleModel.find({ tags: id });

   // Wyszukaj domyślny tag (np. LIBRUS)
   const defaultTag = await TagModel.findOne({
     name: 'LIBRUS',
     isDefault: true,
   });
   appAssert(defaultTag, EHttpCodes.NOT_FOUND, 'Domyślny tag nie został znaleziony.');

   // Jeśli artykuł ma tylko jeden tag i jest to tag, który chcemy usunąć
   for (const article of articlesWithTag) {
     if (article.tags?.length === 1 && article.tags[0]?.toString() === id) {
       // Jeśli artykuł ma tylko jeden tag, przypisz domyślny tag i usuń ten tag
       await ArticleModel.updateOne(
         { _id: article._id },
         {
           $addToSet: { tags: defaultTag._id }, // Dodaj domyślny tag
         },
       );

       // Teraz usuń usuwany tag w osobnej operacji
       await ArticleModel.updateOne(
         { _id: article._id },
         { $pull: { tags: id } }, // Usuń usuwany tag
       );
     } else {
       // Jeśli artykuł ma więcej niż jeden tag, po prostu usuń tag
       await ArticleModel.updateOne(
         { _id: article._id },
         { $pull: { tags: id } }, // Usuń usuwany tag
       );
     }
   }

   // Usuń tag z bazy danych
   await TagModel.findByIdAndDelete(id);
   return {message:"Tag has been deleted sucessfully"}
}