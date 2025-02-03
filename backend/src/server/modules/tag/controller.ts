import { EHttpCodes } from '../../../enums/http.js';
import ArticleModel from '../../../modules/article/schema.model.js';
import TagModel from '../../../modules/tag/model.js';
import { newTagSchema } from '../../../modules/tag/schema.js';
import { createTag, getTag } from '../../../services/tag.service.js';
import appAssert from '../../../utils/appAssert.js';
import catchErrors from '../../../utils/catchErrors.js';

export const createTagHandler = catchErrors(async (req, res) => {
  const request = newTagSchema.parse(req.body);
  const { userId } = req;
  const newTag = await createTag({ request, userId });

  return res.status(EHttpCodes.OK).json(newTag);
});

// export const getTagsHandler = catchErrors(
//     async(req,res)=>{

//         const tags = await TagModel.find({isDefault:false}).select(["-createdBy"]);
//         return res.status(OK).json(tags)
//     }
// )

export const getTagsHandler = catchErrors(async (req, res) => {
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

  // Zwracamy dane
  return res.status(200).json({
    tags,
    totalCount,
  });
});

export const getSingleTagHandler = catchErrors(async (req, res) => {
  const { id } = req.params;
  const conversationTopic = await getTag({ tagId: id as string });
  return res.status(EHttpCodes.OK).json(conversationTopic);
});

export const updateTagHandler = catchErrors(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  // Znajdź istniejący tag po ID
  const tag = await TagModel.findById({ _id: id });
  appAssert(tag, EHttpCodes.NOT_FOUND, 'Tag not found');

  // Sprawdź, czy istnieje inny tag z taką samą nazwą
  if (name && name !== tag.name) {
    const existingTag = await TagModel.exists({ name });
    appAssert(!existingTag, EHttpCodes.CONFLICT, 'Tag already exists');
  }

  // Zaktualizuj nazwę tagu
  tag.name = name || tag.name;

  await tag.save();

  res.status(EHttpCodes.OK).json({ message: 'Tag został zaktualizowany' });
});

export const deleteTagHandler = catchErrors(async (req, res) => {
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
    if (article.tags.length === 1 && article.tags[0].toString() === id) {
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

  return res.status(EHttpCodes.OK).json({ message: 'Tag został usunięty pomyślnie.' });
});
