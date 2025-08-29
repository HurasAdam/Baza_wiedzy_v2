import catchErrors from "../../utils/catchErrors";
import { AttachmentService } from "./attachment.service";

export const AttachmentController = (attachmentService = AttachmentService) => ({
    create: catchErrors(async (req, res) => {
        const { params, body, userId } = req;
        const file = req.file; // << multer zapisuje tutaj

        if (!file) return res.status(400).json({ error: "Brak pliku" });

        const ownerId = params.articleId;
        console.log("BODY", body);
        const attachment = await attachmentService.create(
            file,
            { title: body.title, description: body.note }, // dopasowujemy pola
            userId,
            "Article",
            ownerId
        );

        return res.status(200).json(attachment);
    }),

    find: catchErrors(async ({ params }, res) => {
        const { articleId } = params;
        const attachments = await attachmentService.find(articleId);
        return res.status(200).json(attachments);
    }),
});
