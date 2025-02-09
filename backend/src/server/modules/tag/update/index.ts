import { EHttpCodes } from '../../../../enums/http.js';
import TagModel from '../../../../modules/tag/model.js';
import appAssert from '../../../../utils/appAssert.js';
import catchErrors from '../../../../utils/catchErrors.js';
import type { IUpdateTagReq } from './types.js';
import type express from 'express';

export default (): ((req: IUpdateTagReq, res: express.Response, next: express.NextFunction) => Promise<void>) => {
  return catchErrors(async (req, res) => {
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
    tag.name = name ?? tag.name;

    await tag.save();

    res.status(EHttpCodes.OK).json({ message: 'Tag został zaktualizowany' });
  });
};
