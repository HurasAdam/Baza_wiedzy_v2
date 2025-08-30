/**
 *@copyright 2025 Huras Adam
 *@license Apache-2.0
 */

/**
 *  CUstom modules
 */
import { BAD_REQUEST, NO_CONTENT } from "../../constants/http";
import appAssert from "../../utils/appAssert";

import catchErrors from "../../utils/catchErrors";
import { AttachmentService } from "./attachment.service";
import { articleAttachmentResponseDto } from "./dto/response-dto/article-attachment-response.dto";
import { articleAttachmentListResponseDto } from "./dto/response-dto/article-attachments-list-response.dto";

export const AttachmentController = (attachmentService = AttachmentService) => ({
    create: catchErrors(async (req, res) => {
        const { params, body, userId } = req;
        const file = req.file;

        appAssert(file, BAD_REQUEST, "Missing file");

        const ownerId = params.articleId;

        const attachment = await attachmentService.create(
            file,
            { title: body.title, description: body.note },
            userId,
            "Article",
            ownerId
        );

        return res.status(200).json(attachment);
    }),

    find: catchErrors(async ({ params }, res) => {
        const { articleId } = params;
        const serviceResponse = await attachmentService.find(articleId);
        const response = serviceResponse.map((attachment) => articleAttachmentListResponseDto.parse(attachment));

        return res.status(200).json(response);
    }),

    findOne: catchErrors(async ({ params }, res) => {
        const { articleId, attachmentId } = params;
        const serviceResponse = await attachmentService.findOne(articleId, attachmentId);
        const response = articleAttachmentResponseDto.parse(serviceResponse);

        return res.status(200).json(response);
    }),

    deleteOne: catchErrors(async ({ params }, res) => {
        const { attachmentId } = params;
        await attachmentService.deleteOne(attachmentId);
        return res.send(NO_CONTENT);
    }),
});
