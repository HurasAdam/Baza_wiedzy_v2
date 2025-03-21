import { Request, Response, NextFunction } from "express";
import { CONFLICT, NOT_FOUND } from "@/constants/http";
import TagModel from "@/features/tag/tag.model";

// Middleware sprawdzający, czy tag jest domyślny
const preventDeleteDefaultTag = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    // Znajdź tag po ID
    const tag = await TagModel.findById(id);
    if (!tag) {
        return res.status(NOT_FOUND).json({ message: "Tag nie znaleziony." });
    }

    // Sprawdź, czy tag jest domyślny
    if (tag.isDefault) {
        return res.status(CONFLICT).json({ message: "Nie można usunąć domyślnego tagu." });
    }

    // Jeśli tag nie jest domyślny, przejdź do kolejnego middleware / kontrolera
    next();
};

export default preventDeleteDefaultTag;
