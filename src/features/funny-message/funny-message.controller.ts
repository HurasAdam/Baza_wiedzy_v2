import { OK } from "@/constants/http";
import catchErrors from "@/utils/catchErrors";

import { createFunnyMessageDto } from "./dto/create-funny-message.dto";
import { searchFunnyMessagesDto } from "./dto/search-funny-messages.dto";
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

    // deleteOne: catchErrors(async ({ params }, res) => {
    //     await funnyMessageService.deleteOne(params.id);
    //     res.sendStatus(NO_CONTENT);
    // }),

    // updateOne: catchErrors(async ({ userId, params, body }, res) => {
    //     await funnyMessageService.updateOne(userId, params.id, body);
    //     res.status(OK).json({ message: "Artykuł został zaktualizowany" });
    // }),
});
