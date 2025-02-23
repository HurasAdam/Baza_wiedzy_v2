import UserModel from '../../../../user/model.js';
import ArticleModel from '../../../models/schema.js';
import type GetFavArticlesDto from './dto.js';
import type { IArticle } from '../../../../../types/article.js';

export default async (
  dto: GetFavArticlesDto,
): Promise<{ favouriteArticles: IArticle[]; totalFavouriteArticles: number; pageNumber: number; pageSize: number }> => {
  const pageSize = 15; // Liczba wyników na stronę
  const pageNumber = parseInt(dto.page ?? '1');
  const skip = (pageNumber - 1) * pageSize;

  // Znalezienie użytkownika na podstawie ID i pobranie ulubionych artykułów
  const user = await UserModel.findById(dto.userId).select('favourites');

  if (!user) {
    throw new Error('User not found');
  }

  // Wyciągnięcie tablicy ID artykułów z ulubionych
  const { favourites } = user;

  // Pobranie artykułów na podstawie ID w ulubionych z paginacją
  const favouriteArticles = await ArticleModel.find({
    _id: { $in: favourites },
  })
    .select([
      '-clientDescription',
      '-employeeDescription',
      '-createdBy',
      '-verifiedBy',
      '-createdAt',
      '-viewsCounter',
      '-__v',
    ])
    .populate([{ path: 'tags', select: ['name'] }])
    .skip(skip)
    .limit(pageSize);

  // Jeśli chcesz, możesz również zwrócić całkowitą liczbę ulubionych artykułów, aby obsłużyć paginację na froncie
  const totalFavouriteArticles = await ArticleModel.countDocuments({
    _id: { $in: favourites },
  });

  return {
    favouriteArticles,
    totalFavouriteArticles,
    pageNumber,
    pageSize,
  };
};
