import { EHttpCodes } from '../../../../enums/http.js';
import appAssert from '../../../../utils/appAssert.js';
import ArticleModel from '../../../article/models/schema.js';
import TagModel from '../../model.js';
import type RemoveTagDto from './dto.js';

export default async (dto: RemoveTagDto): Promise<{ message: string }> => {
  const { id } = dto;

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
  return { message: 'Tag has been deleted sucessfully' };
};
