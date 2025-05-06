import { CONFLICT, NOT_FOUND } from "../../constants/http";
import ConversationReportModel from "../conversation-report/conversation-report.model";
import ConversationTopicModel from "./conversation-topic.model";
import appAssert from "../../utils/appAssert";
import catchErrors from "@/utils/catchErrors";
import { SearchTopicDto } from "./dto/search-topic.dto";
import { CreateTopicDto } from "./dto/create-topic.dto";
import ProductModel from "../product/product.model";
import { Types } from "mongoose";

interface CreateConversationTopicRequest {
    title: string;
    product: string;
}

export const ConversationTopicService = {
    create: async (payload: CreateTopicDto, userId: string) => {
        const { title, product } = payload;

        const conversationTopicExists = await ConversationTopicModel.exists({ title, product });
        appAssert(
            !conversationTopicExists,
            CONFLICT,
            "Conversation topic with this title already exists for the specified product"
        );

        const createdConversationTopic = await ConversationTopicModel.create({
            title,
            product,
            createdBy: userId,
        });

        return { data: createdConversationTopic, message: "Conversation topic created successfully" };
    },

    find: async (query: SearchTopicDto) => {
        const querydb: any = {};

        const title = query.title?.trim();
        const product = query.product?.trim();

        if (title) {
            querydb.title = new RegExp(title, "i");
        }
        if (product) {
            querydb.product = product;
        }

        const conversationTopics = await ConversationTopicModel.find(querydb)
            .populate([{ path: "product", select: ["name", "labelColor", "banner", "-_id"] }])
            .sort("product.name");

        return conversationTopics;
    },

    findOne: async (topicId: string, userId: string) => {
        const conversationTopic = await ConversationTopicModel.findById({ _id: topicId }).populate([
            { path: "product", select: ["name"] },
        ]);
        return conversationTopic;
    },

    deleteOne: async (topicId: string) => {
        const conversationTopic = await ConversationTopicModel.findById({ _id: topicId });
        appAssert(conversationTopic, NOT_FOUND, "Conversation topic not found");

        const deleteConversationTopic = await ConversationTopicModel.findByIdAndDelete({ _id: topicId });

        await ConversationReportModel.updateMany({ topic: topicId }, { $set: { topic: null } });
    },

    updateOne: async (topicId: string, payload: CreateTopicDto) => {
        const { title, product } = payload;

        const conversationTopic = await ConversationTopicModel.findById({ _id: topicId });
        appAssert(conversationTopic, NOT_FOUND, "Conversation topic not found");

        if (product) {
            const assignedProduct = await ProductModel.findById({ _id: product });
            appAssert(assignedProduct, NOT_FOUND, "Product not found");
        }

        if (title && product) {
            const existingTopic = await ConversationTopicModel.findOne({
                title,
                product,
                _id: { $ne: topicId },
            });

            appAssert(!existingTopic, CONFLICT, "Tytuł tematu rozmowy już istnieje dla tego produktu");
        }

        conversationTopic.title = title || conversationTopic.title;
        conversationTopic.product = product ? new Types.ObjectId(product) : conversationTopic.product;
        await conversationTopic.save();
    },
};
