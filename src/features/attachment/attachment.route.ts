import { Router } from "express";
import { createUploader } from "../../middleware/upload";
import { AttachmentController } from "./attachment.controller";

export const attachmentRoutes = Router();
export const attachmentController = AttachmentController();

// prefix /attachments

const articleUploader = createUploader({
    folderPrefix: "articles",
    subFolderFn: (req) => req.params.articleId,
    maxSizeMB: 10,
    allowedTypes: [
        "image/*",
        "application/pdf",
        "text/*",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ],
});

attachmentRoutes.post("/articles/:articleId", articleUploader.single("file"), attachmentController.create);
attachmentRoutes.get("/articles/:articleId", attachmentController.find);
attachmentRoutes.get("/articles/:articleId/attachment/:attachmentId", attachmentController.findOne);
attachmentRoutes.delete("/articles/:attachmentId", attachmentController.deleteOne);
