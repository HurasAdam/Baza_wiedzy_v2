import ExcelJS from "exceljs";
import mongoose, { PipelineStage } from "mongoose";
import ArticleHistoryModel from "../article-history/article-history.model";
import ArticleModel from "../article/article.model";
import ConversationReportModel from "../conversation-report/conversation-report.model";
import { FindUsersWithDto } from "../user/dto/find-users-with.dto";
import UserModel from "../user/user.model";
import { DateRangeFilterDto } from "./dto/request-dto/date-range-filter.dto";
import { UserExportRow } from "./types/statistics.types";

interface UserConversationReportDTO {
    name: string;
    count: number;
    labelColor: string;
}

export const StatisticsService = {
    async findAllUsersStatistics(query: FindUsersWithDto) {
        const now = new Date();

        // jeśli nie podano zakresu, domyślnie dzisiejszy dzień
        const startDate = query.startDate ? new Date(query.startDate) : new Date(now.setHours(0, 0, 0, 0));
        const endDate = query.endDate ? new Date(query.endDate) : new Date(now.setHours(23, 59, 59, 999));

        const dateFilter: any = {
            createdAt: { $gte: startDate, $lte: endDate },
        };

        // Added articles
        const articlesAddedAgg = await ArticleModel.aggregate([
            { $match: dateFilter },
            { $group: { _id: "$createdBy", count: { $sum: 1 } } },
        ]);
        const articlesAddedMap = new Map<string, number>();
        articlesAddedAgg.forEach((a) => articlesAddedMap.set(a._id.toString(), a.count));

        // Edited articles
        const articlesEditedAgg = await ArticleHistoryModel.aggregate([
            { $match: { eventType: "updated", createdAt: dateFilter.createdAt } },
            { $group: { _id: "$createdBy", articles: { $addToSet: "$articleId" } } },
            { $project: { count: { $size: "$articles" } } },
        ]);
        const articlesEditedMap = new Map<string, number>();
        articlesEditedAgg.forEach((a) => articlesEditedMap.set(a._id.toString(), a.count));

        // Added conversation reports
        const conversationsAgg = await ConversationReportModel.aggregate([
            { $match: dateFilter },
            { $group: { _id: "$createdBy", count: { $sum: 1 } } },
        ]);
        const conversationsMap = new Map<string, number>();
        conversationsAgg.forEach((c) => conversationsMap.set(c._id.toString(), c.count));

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
            {
                $lookup: {
                    from: "attachments",
                    localField: "profilePicture",
                    foreignField: "_id",
                    as: "avatar",
                },
            },
            { $unwind: { path: "$avatar", preserveNullAndEmptyArrays: true } },
            { $match: { "roleInfo.name": { $ne: "ADMIN" } } },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    surname: 1,
                    email: 1,
                    role: "$roleInfo.name",
                    avatar: {
                        path: "$avatar.path",
                        filename: "$avatar.filename",
                    },
                },
            },
        ]);

        return users.map((user) => ({
            userId: user._id,
            name: user.name,
            surname: user.surname,
            email: user.email,
            role: user.role,
            avatar: user.avatar ? user.avatar.path : null,
            stats: {
                articlesAdded: articlesAddedMap.get(user._id.toString()) || 0,
                articlesEdited: articlesEditedMap.get(user._id.toString()) || 0,
                conversationTopics: conversationsMap.get(user._id.toString()) || 0,
            },
        }));
    },
    async findUserAddedArticles(userId: string, payload: DateRangeFilterDto) {
        const now = new Date();

        const startDate = payload.startDate ? payload.startDate : new Date(now.setHours(0, 0, 0, 0));
        const endDate = payload.endDate ? payload.endDate : new Date(now.setHours(23, 59, 59, 999));

        const filter = {
            createdBy: userId,
            createdAt: { $gte: startDate, $lte: endDate },
        };

        const userAddedArticles = await ArticleModel.find(filter)
            .sort({ createdAt: -1 })
            .populate({ path: "product", select: "name" });

        return userAddedArticles;
    },

    async findUserEditedArticles(userId: string, payload: DateRangeFilterDto) {
        const now = new Date();

        const startDate = payload.startDate ? new Date(payload.startDate) : new Date(now.setHours(0, 0, 0, 0));
        const endDate = payload.endDate ? new Date(payload.endDate) : new Date(now.setHours(23, 59, 59, 999));

        const historyEntries = await ArticleHistoryModel.find({
            createdBy: userId,
            eventType: "updated",
            createdAt: { $gte: startDate, $lte: endDate },
        })
            .sort({ createdAt: -1 })
            .populate({
                path: "articleId",
                select: "title product",
                populate: { path: "product", select: "name" },
            });

        const seenIds = new Set<string>();
        const editedArticles = historyEntries
            .map((entry) => entry.articleId)
            .filter((article) => {
                if (!article) return false;
                const id = article._id.toString();
                if (seenIds.has(id)) return false;
                seenIds.add(id);
                return true;
            });

        return editedArticles;
    },

    async findUserConversationReports(userId: string, payload: DateRangeFilterDto) {
        const now = new Date();

        const startDate = payload.startDate ? new Date(payload.startDate) : new Date(now.setHours(0, 0, 0, 0));
        const endDate = payload.endDate ? new Date(payload.endDate) : new Date(now.setHours(23, 59, 59, 999));

        // Aggregation pipeline
        const pipeline = [
            {
                $match: {
                    createdBy: new mongoose.Types.ObjectId(userId),
                    createdAt: { $gte: startDate, $lte: endDate },
                },
            },
            {
                $lookup: {
                    from: "conversationtopics",
                    localField: "topic",
                    foreignField: "_id",
                    as: "topic",
                },
            },
            { $unwind: "$topic" },
            {
                $lookup: {
                    from: "products",
                    localField: "topic.product",
                    foreignField: "_id",
                    as: "product",
                },
            },
            { $unwind: "$product" },
            {
                $group: {
                    _id: "$product._id",
                    name: { $first: "$product.name" },
                    labelColor: { $first: "$product.labelColor" },
                    count: { $sum: 1 },
                },
            },
            { $sort: { count: -1 } },
        ];

        const result = await ConversationReportModel.aggregate<UserConversationReportDTO>(pipeline as PipelineStage[]);

        return result;
    },
    async findMyStatistics() {},

    async generateUsersExcel(users: UserExportRow[]) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Statystyki użytkowników");

        worksheet.columns = [
            { header: "Imię", key: "name", width: 20 },
            { header: "Nazwisko", key: "surname", width: 20 },
            { header: "Email", key: "email", width: 30 },
            { header: "Dodane artykuły", key: "articlesAdded", width: 15 },
            { header: "Edytowane artykuły", key: "articlesEdited", width: 15 },
            { header: "Odnotowane tematy", key: "conversationTopics", width: 15 },
        ];

        users.forEach((user) => {
            worksheet.addRow({
                name: user.name ?? "",
                surname: user.surname ?? "",
                email: user.email ?? "",
                articlesAdded: user.articlesAdded ?? 0,
                articlesEdited: user.articlesEdited ?? 0,
                conversationTopics: user.conversationTopics ?? 0,
            });
        });

        return workbook.xlsx.writeBuffer();
    },
};
