import { CONFLICT } from "@/constants/http";
import appAssert from "@/utils/appAssert";

import type { CreateFunnyMessageDto } from "./dto/create-funny-message.dto";
import FunnyMessageModel from "./funny-message.model";

export const FunnyMessageService = {
    async create(userId: string, payload: CreateFunnyMessageDto) {
        const funnyMessage = await FunnyMessageModel.exists({ title: payload.title });
        appAssert(!funnyMessage, CONFLICT, "Article already exists");

        const newFunnyMessage = await FunnyMessageModel.create({
            ...payload,
            createdBy: userId,
        });

        return newFunnyMessage;
    },

    async find(userId: string, query) {
        const { page, limit, sortBy, sortAt, title, author } = query;

        const filter: Record<string, any> = {};

        if (title && title.trim() !== "") {
            filter.title = { $regex: title, $options: "i" };
        }

        if (author && author.trim() !== "") {
            filter.createdBy = author;
        }
        const skip = (page - 1) * limit;

        const funnyMessages = await FunnyMessageModel.find(filter)
            .populate([{ path: "createdBy", select: ["name", "surname"] }])
            .skip(skip)
            .limit(limit)
            .sort([[sortBy, sortAt]]);

        const total = await FunnyMessageModel.countDocuments(filter);

        return {
            data: funnyMessages,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
            },
        };
    },
};
