import { BAD_REQUEST, NOT_FOUND } from "@/constants/http";
import appAssert from "@/utils/appAssert";
import { compareValue, hashValue } from "@/utils/bcrypt";
import ArticleHistoryModel from "../article-history/article-history.model";
import ArticleModel from "../article/article.model";
import RoleModel from "../role-permission/roles-permission.model";
import type { FindUsersWithDto } from "./dto/find-users-with.dto";
import UserModel from "./user.model";

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

        const start = startDate ? new Date(startDate as string) : undefined;
        let end = endDate ? new Date(endDate as string) : undefined;

        if (end) {
            end.setHours(23, 59, 59, 999);
        }

        const reportCounts = await UserModel.aggregate([
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
                $match: {
                    "roleInfo.name": { $ne: "ADMIN" },
                },
            },
            {
                $lookup: {
                    from: "conversationreports",
                    let: { userId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$createdBy", "$$userId"] },
                                ...(start || end
                                    ? {
                                          createdAt: {
                                              ...(start ? { $gte: start } : {}),
                                              ...(end ? { $lte: end } : {}),
                                          },
                                      }
                                    : {}),
                            },
                        },
                    ],
                    as: "reports",
                },
            },
            {
                $project: {
                    userId: "$_id",
                    name: 1,
                    surname: 1,
                    email: 1,
                    count: { $size: "$reports" },
                    role: "$roleInfo.name",
                },
            },
        ]);
        return reportCounts;
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

            if (startDate) {
                dateFilter.createdAt.$gte = new Date(startDate);
            }

            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                dateFilter.createdAt.$lte = end;
            }
        }

        const articleCounts = await ArticleModel.aggregate([
            { $match: dateFilter },
            {
                $group: {
                    _id: "$createdBy",
                    count: { $sum: 1 },
                },
            },
        ]);

        const articleCountMap = new Map<string, number>();
        articleCounts.forEach((item) => {
            articleCountMap.set(item._id.toString(), item.count);
        });

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
                $match: {
                    "roleInfo.name": { $ne: "ADMIN" },
                },
            },
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

        const result = users.map((user) => ({
            _id: user._id,
            userId: user._id,
            name: user.name,
            surname: user.surname,
            email: user.email,
            role: user.role,
            count: articleCountMap.get(user._id.toString()) || 0,
        }));

        return result;
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
