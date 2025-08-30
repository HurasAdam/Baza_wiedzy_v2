import fs from "fs";
import { Types } from "mongoose";
import path from "path";
import { FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND } from "../../constants/http";
import appAssert from "../../utils/appAssert";
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
        })
            .sort({ createdAt: -1 })
            .select("filename title mimeType size createdAt ownerId path")
            .lean();

        return attachments;
    },
    findOne: async (articleId: string, attachmentId: string) => {
        if (!Types.ObjectId.isValid(articleId)) throw new Error("Nieprawidłowe ID artykułu");
        if (!Types.ObjectId.isValid(attachmentId)) throw new Error("Nieprawidłowe ID attachmentu");

        const attachment = await AttachmentModel.findById(attachmentId)
            .populate({
                path: "uploadedBy",
                select: ["name", "surname", "email", "profilePicture"],
                populate: {
                    path: "profilePicture",
                    model: "Attachment",
                    select: ["_id", "path", "filename", "mimeType"], // <--- ważne!
                },
            })
            .lean();

        appAssert(attachment, NOT_FOUND, "Attachment not found");

        appAssert(attachment.ownerId, INTERNAL_SERVER_ERROR, "Attachment ownerId is missing");
        appAssert(
            attachment.ownerType === "Article" && attachment.ownerId.toString() === articleId,
            FORBIDDEN,
            "Attachment does not belong to this article"
        );

        return attachment;
    },

    deleteOne: async (attachmentId: string) => {
        if (!Types.ObjectId.isValid(attachmentId)) throw new Error("Nieprawidłowe ID załącznika");

        const attachment = await AttachmentModel.findById(attachmentId);
        if (!attachment) throw new Error("Załącznik nie istnieje");

        // usuń plik z dysku
        const filePath = path.resolve(attachment.path);
        fs.unlink(filePath, (err) => {
            if (err) console.error("Błąd usuwania pliku:", err);
        });

        // usuń dokument z bazy
        await AttachmentModel.findByIdAndDelete(attachmentId);
    },
};
