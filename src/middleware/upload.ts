import type { Request } from "express";
import fs from "fs";
import multer from "multer";
import path from "node:path";

// Multer storage z podfolderem po userId
const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb) => {
        const userId = req.userId;
        const uploadDir = path.join("/app/uploads/users", userId);

        // Utwórz folder, jeśli jeszcze nie istnieje
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

        cb(null, uploadDir);
    },
    filename: (req: Request, file: Express.Multer.File, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

//  max 5MB
export const avatarUploader = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) cb(null, true);
        else cb(new Error("Only images are allowed"));
    },
});
