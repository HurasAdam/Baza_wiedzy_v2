import { EHttpCodes } from '../../../../enums/http.js';
import TagModel from '../../../../modules/tag/model.js';
import { getTag } from '../../../../modules/tag/repository/index.js';
import catchErrors from '../../../../utils/catchErrors.js';
import type express from 'express';

export const getSingle = (): ((
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const { id } = req.params;
    const conversationTopic = await getTag({ tagId: id as string });
    res.status(EHttpCodes.OK).json(conversationTopic);
  });
};

export const getMany = (): ((
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => Promise<void>) => {
  return catchErrors(async (req, res) => {
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
    res.status(200).json({
      tags,
      totalCount,
    });
  });
};
