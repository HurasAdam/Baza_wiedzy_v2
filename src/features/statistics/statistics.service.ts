import ArticleHistoryModel from "../article-history/article-history.model";
import ArticleModel from "../article/article.model";
import ConversationReportModel from "../conversation-report/conversation-report.model";
import { FindUsersWithDto } from "../user/dto/find-users-with.dto";
import UserModel from "../user/user.model";

export const StatisticsService = {
    async findAllUsersStatistics(query: FindUsersWithDto) {
        const now = new Date();

        // if no query set today as default
        const startDate = query.startDate ? new Date(query.startDate) : new Date(now.setHours(0, 0, 0, 0));
        const endDate = query.endDate ? new Date(query.endDate) : new Date(now.setHours(23, 59, 59, 999));

        const dateFilter: any = {
            createdAt: { $gte: startDate, $lte: endDate },
        };

        // 1 articles added
        const articlesAddedAgg = await ArticleModel.aggregate([
            { $match: dateFilter },
            { $group: { _id: "$createdBy", count: { $sum: 1 } } },
        ]);
        const articlesAddedMap = new Map<string, number>();
        articlesAddedAgg.forEach((a) => articlesAddedMap.set(a._id.toString(), a.count));

        // 2 articles edited
        const articlesEditedAgg = await ArticleHistoryModel.aggregate([
            { $match: { eventType: "updated", createdAt: dateFilter.createdAt } },
            { $group: { _id: "$createdBy", count: { $sum: 1 } } },
        ]);
        const articlesEditedMap = new Map<string, number>();
        articlesEditedAgg.forEach((a) => articlesEditedMap.set(a._id.toString(), a.count));

        // 3 conversation reports
        const conversationsAgg = await ConversationReportModel.aggregate([
            { $match: dateFilter },
            { $group: { _id: "$createdBy", count: { $sum: 1 } } },
        ]);
        const conversationsMap = new Map<string, number>();
        conversationsAgg.forEach((c) => conversationsMap.set(c._id.toString(), c.count));

        // except users with admin role
        const users = await UserModel.aggregate([
            {
                $lookup: {
                    from: "roles",
                    localField: "role",
                    foreignField: "_id",
                    as: "roleInfo",
                },
            },
            { $unwind: "$roleInfo" },
            { $match: { "roleInfo.name": { $ne: "ADMIN" } } },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    surname: 1,
                    email: 1,
                    role: "$roleInfo.name",
                },
            },
        ]);

        return users.map((user) => ({
            userId: user._id,
            name: user.name,
            surname: user.surname,
            email: user.email,
            role: user.role,
            stats: {
                articlesAdded: articlesAddedMap.get(user._id.toString()) || 0,
                articlesEdited: articlesEditedMap.get(user._id.toString()) || 0,
                conversationTopics: conversationsMap.get(user._id.toString()) || 0,
            },
        }));
    },
    async findMyStatistics() {},
};
