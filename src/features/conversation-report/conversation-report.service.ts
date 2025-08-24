import mongoose from "mongoose";
import { CONFLICT } from "../../constants/http";
import appAssert from "../../utils/appAssert";
import ConversationTopicModel from "../conversation-topic/conversation-topic.model";
import ConversationReportModel from "./conversation-report.model";

interface CreateConversationTopicRequest {
    description?: string;
    topic: string;
    type: string;
}

export const ConversationReportService = {
    async addConversationReport(userId: string, payload: CreateConversationTopicRequest) {
        const { topic, description, type } = payload;

        const conversationTopic = await ConversationTopicModel.exists({ topic });
        appAssert(!conversationTopic, CONFLICT, "Conversation topic does not exist");

        const createdConversationTopic = await ConversationReportModel.create({
            description,
            type,
            createdBy: userId,
            topic,
        });
        return createdConversationTopic;
    },
    async find(query) {
        const { startDate, endDate, userId, limit } = query;
        const match: any = {};

        if (startDate && endDate) {
            match.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        }

        if (userId) {
            match.createdBy = new mongoose.Types.ObjectId(userId);
        }

        return ConversationReportModel.aggregate([
            { $match: match },
            {
                $lookup: {
                    from: "conversationtopics",
                    localField: "topic",
                    foreignField: "_id",
                    as: "topicDetails",
                },
            },
            { $unwind: "$topicDetails" },
            {
                $group: {
                    _id: "$topicDetails.title",
                    count: { $sum: 1 },
                },
            },
            { $sort: { count: -1 } },
            { $limit: limit },
            {
                $project: {
                    _id: 0,
                    title: "$_id",
                    count: 1,
                },
            },
        ]);
    },
    async findByUser(userId: string, query) {
        const queryDb: any = { createdBy: userId };

        const { startDate, endDate } = query;

        if (startDate && endDate) {
            queryDb.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        }
        return ConversationReportModel.find(queryDb).populate("topic").sort({ createdAt: -1 });
    },
};
