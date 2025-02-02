import { EHttpCodes } from '../../enums/http.js';
import TagModel from '../../models/tag.model.js';
import type { Request, Response, NextFunction } from 'express';

// Middleware sprawdzający, czy tag jest domyślny
const preventDeleteDefaultTag = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;

  // Znajdź tag po ID
  const tag = await TagModel.findById(id);
  if (!tag) {
    res.status(EHttpCodes.NOT_FOUND).json({ message: 'Tag nie znaleziony.' });
    return;
  }

  // Sprawdź, czy tag jest domyślny
  if (tag.isDefault) {
    res.status(EHttpCodes.CONFLICT).json({ message: 'Nie można usunąć domyślnego tagu.' });
    return;
  }

  // Jeśli tag nie jest domyślny, przejdź do kolejnego middleware / kontrolera
  next();
};

export default preventDeleteDefaultTag;
