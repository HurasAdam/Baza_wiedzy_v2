import { EHttpCodes } from '../../../../enums/http.js';
import appAssert from '../../../../utils/appAssert.js';
import ArticleModel from '../../../article/models/schema.js';
import ArticleRepository from '../../../article/repository/article.js';
import TagModel from '../../model.js';
import TagRepository from '../../repository/index.js';
import type RemoveTagDto from './dto.js';
import type { IArticleEntity } from '../../../article/types.js';
import type { ITagEntity } from '../../types.js';

const updateArticle = async (article: IArticleEntity, id: string, tag: ITagEntity): Promise<void> => {
  const articleRepo = new ArticleRepository();

  if (article.tags?.length === 1 && article.tags[0]?.toString() === id) {
    // Jeśli artykuł ma tylko jeden tag, przypisz domyślny tag i usuń ten tag
    await articleRepo.update(article._id.toString(), {
      $addToSet: { tags: tag._id },
    });

    // Teraz usuń usuwany tag w osobnej operacji
    await articleRepo.update(article._id.toString(), { $pull: { tags: id } });
  } else {
    await articleRepo.update(article._id as string, { $pull: { tags: id } });
  }
};

/**
 * Export controller, for endpoint to remove tag.
 * @param dto
 * @returns RemoveTag.
 */
export default async (dto: RemoveTagDto): Promise<{ message: string }> => {
  const { id } = dto;

  const tagRepo = new TagRepository();

  // Znajdź tag, który próbujesz usunąć
  const tag = await TagModel.findById(id);
  appAssert(tag, EHttpCodes.NOT_FOUND, 'Tag not found');

  // Znajdź artykuły, które mają ten tag
  const articlesWithTag = await ArticleModel.find({ tags: id });

  // Wyszukaj domyślny tag (np. LIBRUS)
  const defaultTag = await tagRepo.get({
    name: 'LIBRUS',
    isDefault: true,
  });
  appAssert(
    defaultTag || (defaultTag as ITagEntity[]).length > 0,
    EHttpCodes.NOT_FOUND,
    'Domyślny tag nie został znaleziony.',
  );

  // Jeśli artykuł ma tylko jeden tag i jest to tag, który chcemy usunąć
  await Promise.all(articlesWithTag.map((a) => updateArticle(a, id, defaultTag[0]!)));

  // Usuń tag z bazy danych
  await TagModel.findByIdAndDelete(id);
  return { message: 'Tag has been deleted successfully' };
};
