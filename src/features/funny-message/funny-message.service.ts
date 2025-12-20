import { CONFLICT, FORBIDDEN, NOT_FOUND } from "@/constants/http";
import appAssert from "@/utils/appAssert";

import type { CreateFunnyMessageDto } from "./dto/create-funny-message.dto";
import { UpdateFunnyMessageDto } from "./dto/update-funny-message.dto";
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
    async findOne(id: string) {
        const funnyMessage = await FunnyMessageModel.findById(id).populate([
            { path: "createdBy", select: ["name", "surname"] },
        ]);

        return funnyMessage;
    },

    async updateOne(userId: string, id: string, payload: UpdateFunnyMessageDto) {
        const { title, entries } = payload;
        const funnyMessage = await FunnyMessageModel.findById(id);
        appAssert(funnyMessage, NOT_FOUND, "Wiadomość nie istnieje");

        appAssert(funnyMessage.createdBy.toString() === userId, FORBIDDEN, "Brak uprawnień do edycji");

        if (title) funnyMessage.title = title;

        if (entries) {
            const existingMap = new Map(funnyMessage.entries.map((e) => [e._id.toString(), e]));

            const updatedEntries = entries.map((e) => {
                if (e._id && existingMap.has(e._id)) {
                    const subDoc = existingMap.get(e._id)!;
                    subDoc.author = e.author;
                    subDoc.content = e.content;
                    return subDoc;
                } else {
                    return e;
                }
            });

            funnyMessage.entries = updatedEntries as any; // Mongoose DocumentArray
        }
        await funnyMessage.save();
        return funnyMessage.populate([{ path: "createdBy", select: ["name", "surname"] }]);
    },

    async deleteOne(messageId: string, userId: string) {
        const funnyMessage = await FunnyMessageModel.findById(messageId);
        appAssert(funnyMessage, NOT_FOUND, "Wiadomość nie istnieje");
        appAssert(funnyMessage.createdBy.toString() === userId, FORBIDDEN, "Brak uprawnień do edycji");
        await FunnyMessageModel.findByIdAndDelete(messageId);
        return;
    },
};
