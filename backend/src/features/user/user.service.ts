import { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } from "@/constants/http";
import appAssert from "@/utils/appAssert";
import UserModel from "./user.model";
import ConversationReportModel from "../conversation-report/conversation-report.model";
import ArticleModel from "../article/article.model";
import ArticleHistoryModel from "../article-history/article-history.model";
import type { FindUsersWithDto } from "./dto/find-users-with.dto";
import { compareValue, hashValue } from "@/utils/bcrypt";
import mongoose from "mongoose";
import RoleModel from "../role-permission/roles-permission.model";

export const UserService = {
    async changePassword(userId, payload) {
        const user = await UserModel.findById(userId);
        appAssert(user, NOT_FOUND, "User not found");
        const isSamePassword = compareValue(payload.password, user.password);
        appAssert(!isSamePassword, BAD_REQUEST, "New password cannot be the same as the current password");

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {
                password: hashValue(payload.password),
                mustChangePassword: false,
            },
            { new: true }
        );

        if (!updatedUser) {
            throw new Error("Failed to change password");
        }

        return { message: "Password has been changed successfully" };
    },

    async findOne(id: string) {
        const user = await UserModel.findById(id).populate({
            path: "role",
            select: "name permissions", // wybieramy tylko te pola z roli
        });
        appAssert(user, NOT_FOUND, "User not found");

        return user.omitPassword();
    },

    async findAll(query) {
        const querydb: any = {};
        const name = query.name?.trim();
        const role = query.role?.trim();
        const isActive = query.isActive;
        const excludeAdmin = query.excludeAdmin === "true" || query.excludeAdmin === true;
        if (name) {
            querydb.name = new RegExp(name, "i");
        }
        if (role) {
            querydb.role = role;
        }

        if (isActive) {
            querydb.isActive = isActive;
        }

        if (excludeAdmin) {
            // pobieramy _id roli Administratora
            const adminRole = await RoleModel.findOne({ name: "ADMIN" });
            if (adminRole) {
                // dodajemy do querydb.role: różne od tego ObjectId
                querydb.role = {
                    ...("role" in querydb ? querydb.role : {}),
                    $ne: adminRole._id,
                };
            }
        }

        const users = await UserModel.find(querydb)
            .select(["-password", "-email", "-verified", "-createdAt", "-updatedAt", "-favourites"])
            .populate({
                path: "role",
                select: "name ", // wybieramy tylko te pola z roli
            });
        return users;
    },

    async findWithReportCount(query: FindUsersWithDto) {
        const { startDate, endDate } = query;
        const dateFilter: any = {};

        if (startDate || endDate) {
            dateFilter.createdAt = {};

            startDate && (dateFilter.createdAt.$gte = new Date(startDate));
            endDate && (dateFilter.createdAt.$gte = new Date(endDate));
        }

        const usersWithReportCount = await ConversationReportModel.aggregate([
            {
                $match: dateFilter,
            },
            {
                $group: {
                    _id: "$createdBy",
                    reportCount: { $sum: 1 },
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "user",
                },
            },
            {
                $unwind: "$user",
            },
            {
                $project: {
                    _id: { $toObjectId: "$user._id" },
                    name: "$user.name",
                    surname: "$user.surname",
                    reportCount: 1,
                },
            },
            {
                $sort: {
                    reportCount: -1, // Malejąco
                },
            },
        ]);

        const allUsers = await UserModel.find();

        const usersWithZeroReports = allUsers
            .filter((user) => !usersWithReportCount.some((report) => report._id.toString() === user._id.toString()))
            .map((user) => ({
                _id: user._id,
                name: user.name,
                surname: user.surname,
                reportCount: 0,
            }));

        return [...usersWithReportCount, ...usersWithZeroReports];
    },

    async findWithFavouriteArticles(id: string, query: any) {
        const pageSize = 15; // Liczba wyników na stronę
        const pageNumber = parseInt(query.page ?? "1");
        const skip = (pageNumber - 1) * pageSize;

        const user = await UserModel.findById(id).select("favourites");

        if (!user) {
            throw Error("User not found");
        }

        const favourites = user.favourites;

        const favouriteArticles = await ArticleModel.find({
            _id: { $in: favourites },
        })
            .select([
                "-clientDescription",
                "-employeeDescription",
                "-createdBy",
                "-verifiedBy",
                "-createdAt",
                "-viewsCounter",
                "-__v",
            ])
            .populate([
                { path: "tags", select: ["name"] },
                { path: "product", select: ["name", "labelColor"] },
            ])
            .skip(skip)
            .limit(pageSize);

        const totalFavouriteArticles = await ArticleModel.countDocuments({
            _id: { $in: favourites },
        });

        return {
            data: favouriteArticles,
            currentPage: pageNumber,
            totalPages: Math.ceil(totalFavouriteArticles / pageSize),
        };
    },

    async findWithArticleCount(query: FindUsersWithDto) {
        const { startDate, endDate } = query;
        const dateFilter: any = {};

        if (startDate || endDate) {
            dateFilter.createdAt = {};

            startDate && (dateFilter.createdAt.$gte = new Date(startDate));
            endDate && (dateFilter.createdAt.$gte = new Date(endDate));
        }

        // Agregacja w kolekcji artykułów, aby policzyć liczbę artykułów dla każdego użytkownika
        const usersWithArticleCount = await ArticleModel.aggregate([
            {
                $match: dateFilter,
            },
            {
                $group: {
                    _id: "$createdBy", // Grupowanie po użytkowniku
                    createdArticleCount: { $sum: 1 },
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "user",
                },
            },
            {
                $unwind: "$user",
            },
            {
                $project: {
                    _id: "$user._id",
                    name: "$user.name",
                    surname: "$user.surname",
                    createdArticleCount: 1,
                },
            },
            {
                $sort: {
                    createdArticleCount: -1,
                },
            },
        ]);

        const allUsers = await UserModel.find();

        const usersWithZeroArticles = allUsers
            .filter((user) => !usersWithArticleCount.some((article) => article._id.toString() === user._id.toString()))
            .map((user) => ({
                _id: user._id,
                name: user.name,
                surname: user.surname,
                createdArticleCount: 0,
            }));

        return [...usersWithArticleCount, ...usersWithZeroArticles];
    },

    async findWithChangeCount(query: FindUsersWithDto) {
        const { startDate, endDate } = query;
        const dateFilter: any = {};

        if (startDate || endDate) {
            dateFilter.createdAt = {};

            startDate && (dateFilter.createdAt.$gte = new Date(startDate));
            endDate && (dateFilter.createdAt.$gte = new Date(endDate));
        }

        // Agregacja w kolekcji historii zmian artykułów
        const usersWithChangeCount = await ArticleHistoryModel.aggregate([
            {
                $match: {
                    ...dateFilter,
                    eventType: "updated",
                },
            },
            {
                $group: {
                    _id: "$updatedBy",
                    updatedArticleCount: { $sum: 1 },
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "user",
                },
            },
            {
                $unwind: "$user",
            },
            {
                $project: {
                    _id: "$user._id",
                    name: "$user.name",
                    surname: "$user.surname",
                    updatedArticleCount: 1,
                },
            },
            {
                $sort: {
                    updatedArticleCount: -1,
                },
            },
        ]);

        const allUsers = await UserModel.find();

        const usersWithZeroChanges = allUsers
            .filter((user) => !usersWithChangeCount.some((change) => change._id.toString() === user._id.toString()))
            .map((user) => ({
                _id: user._id,
                name: user.name,
                surname: user.surname,
                updatedArticleCount: 0,
            }));

        return [...usersWithChangeCount, ...usersWithZeroChanges];
    },
};
