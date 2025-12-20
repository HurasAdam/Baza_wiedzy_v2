import { NO_CONTENT, OK } from "@/constants/http";
import catchErrors from "@/utils/catchErrors";

import { objectIdParam } from "../../common/dto/params-id.dto";
import { createFunnyMessageDto } from "./dto/create-funny-message.dto";
import { searchFunnyMessagesDto } from "./dto/search-funny-messages.dto";
import { updateFunnyMessageDto } from "./dto/update-funny-message.dto";
import { FunnyMessageService } from "./funny-message.service";

export const FunnyMessageController = (funnyMessageService = FunnyMessageService) => ({
    create: catchErrors(async ({ userId, body }, res) => {
        const payload = createFunnyMessageDto.parse(body);
        const article = await funnyMessageService.create(userId, payload);
        return res.status(OK).json({ message: "Zabawna wiadomość została dodana", data: article });
    }),

    find: catchErrors(async ({ userId, query }, res) => {
        const payload = searchFunnyMessagesDto.parse(query);
        const articles = await funnyMessageService.find(userId, payload);
        return res.status(OK).json(articles);
    }),
    findOne: catchErrors(async ({ params }, res) => {
        const { messageId } = params;
        const article = await funnyMessageService.findOne(messageId);

        return res.status(OK).json(article);
    }),

    updateOne: catchErrors(async ({ userId, params, body }, res) => {
        const { messageId } = objectIdParam("messageId").parse(params);
        const payload = updateFunnyMessageDto.parse(body);

        const updatedMessage = await funnyMessageService.updateOne(userId, messageId, payload);
        return res.status(OK).json({ message: "Wiadomość została zaktualizowana", data: updatedMessage });
    }),

    deleteOne: catchErrors(async ({ userId, params }, res) => {
        const { messageId } = objectIdParam("messageId").parse(params);
        await funnyMessageService.deleteOne(messageId, userId);
        res.sendStatus(NO_CONTENT);
    }),
});
