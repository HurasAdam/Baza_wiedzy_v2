import { CONFLICT, CREATED, NO_CONTENT, NOT_FOUND, OK } from "@/constants/http";
import appAssert from "@/utils/appAssert";
import catchErrors from "@/utils/catchErrors";
import { constructSearchQuery } from "@/utils/constructSearchQuery";
import ConversationTopicModel from "./conversation-topic.model";
import ProductModel from "@/features/product/product.model";
import { ConversationTopicService } from "./conversation-topic.service";

import { searchTopicDto } from "./dto/search-topic.dto";
import { createTopicDto } from "./dto/create-topic.dto";

export const ConversationTopicController = (conversationTopicService = ConversationTopicService) => ({
    create: catchErrors(async ({ body, userId }, res) => {
        const payload = createTopicDto.parse(body);

        const { data, message } = await conversationTopicService.create(payload, userId);

        return res.status(CREATED).json({ data, message });
    }),

    find: catchErrors(async ({ query }, res) => {
        console.log(query, "TITLE QUERY");
        const payload = searchTopicDto.parse(query);
        const conversationTopics = await conversationTopicService.find(payload);

        return res.status(OK).json(conversationTopics);
    }),

    findOne: catchErrors(async ({ params, userId }, res) => {
        const { id } = params;
        const conversationTopic = await conversationTopicService.findOne(id, userId);
        return res.status(OK).json(conversationTopic);
    }),

    deleteOne: catchErrors(async ({ params }, res) => {
        const { id } = params;
        const conversationTopic = await conversationTopicService.deleteOne(id);
        return res.status(OK).json(conversationTopic);
    }),

    updateOne: catchErrors(async ({ params, body }, res) => {
        const payload = createTopicDto.parse(body);
        await conversationTopicService.updateOne(params.id, payload);

        res.sendStatus(NO_CONTENT);
    }),
});
