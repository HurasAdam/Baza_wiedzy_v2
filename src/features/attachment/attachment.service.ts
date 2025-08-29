import { Types } from "mongoose";
import AttachmentModel from "./attachment.model";

export const AttachmentService = {
    create: async (
        file: Express.Multer.File,
        meta: { title?: string; description?: string },
        userId: string,
        ownerType: "Article" | "Workspace" | "User" | "Loose",
        ownerId?: string
    ) => {
        if (!file) {
            throw new Error("Missing attachment");
        }
        const attachment = await AttachmentModel.create({
            filename: file.originalname,
            path: file.path,
            mimeType: file.mimetype,
            size: file.size,
            uploadedBy: userId,
            ownerType,
            ownerId,
            title: meta.title,
            description: meta.description,
        });
        return attachment;
    },

    find: async (articleId: string) => {
        if (!Types.ObjectId.isValid(articleId)) throw new Error("Nieprawidłowe ID artykułu");

        const attachments = await AttachmentModel.find({
            ownerType: "Article",
            ownerId: articleId,
        }).sort({ createdAt: -1 });

        return attachments;
    },

    deleteOne: async (attachmentId: string) => {},
};
