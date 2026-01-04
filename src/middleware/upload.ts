/**
 * Funkcja tworząca uploader Multer z możliwością ustawienia katalogu i podkatalogu zapisu
 * oraz walidacji typu i rozmiaru pliku.
 *
 *
 * Pozwala w prosty sposób definiować:
 * - prefiks katalogu (np. "users", "articles"),
 * - dynamiczny podfolder (np. po userId lub articleId),
 * - maksymalny rozmiar pliku,
 * - dozwolony typ pliku *MIME*
 *
 * Pliki zapisywane są lokalnie w katalogu `/app/uploads`.
 *
 * @param options
 * @param options.folderPrefix - Główny katalog uploadu (np. "users", "articles")
 * @param options.subFolderFn - Opcjonalna funkcja zwracająca nazwę podfolderu na podstawie requestu
 * @param options.maxSizeMB - Maksymalny rozmiar pliku w MB (domyślnie 5 MB)
 * @param options.allowedTypes - Lista dozwolonych typów MIME (np. ["image/*"])
 *
 * @returns Skonfigurowana instancja multer
 */
import type { Request } from "express";
import fs from "fs";
import multer from "multer";
import path from "node:path";

interface Options {
    folderPrefix: string;
    subFolderFn?: (req: Request) => string;
    maxSizeMB?: number;
    allowedTypes?: string[];
}

export const createUploader = ({ folderPrefix, subFolderFn, maxSizeMB = 5, allowedTypes = ["image/*"] }: Options) => {
    const storage = multer.diskStorage({
        destination: (req: Request, file: Express.Multer.File, cb) => {
            let uploadDir = path.join("/app/uploads", folderPrefix);
            if (subFolderFn) {
                const subFolder = subFolderFn(req);
                uploadDir = path.join(uploadDir, subFolder);
            }
            if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
            cb(null, uploadDir);
        },
        filename: (req: Request, file: Express.Multer.File, cb) => {
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
            cb(null, uniqueSuffix + path.extname(file.originalname));
        },
    });

    return multer({
        storage,
        limits: { fileSize: maxSizeMB * 1024 * 1024 },
        fileFilter: (req, file, cb) => {
            if (
                allowedTypes.some(
                    (type) =>
                        type === file.mimetype || (type.endsWith("/*") && file.mimetype.startsWith(type.split("/")[0]))
                )
            ) {
                cb(null, true);
            } else {
                cb(new Error(`Invalid file type. Allowed: ${allowedTypes.join(", ")}`));
            }
        },
    });
};
