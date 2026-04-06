import { CONFLICT, NOT_FOUND } from "@/constants/http";
import appAssert from "@/utils/appAssert";
import { compareValue } from "@/utils/bcrypt";
import fs from "fs";
import { constructSearchQuery } from "../../utils/constructSearchQuery";
import ArticleHistoryModel from "../article-history/article-history.model";
import ArticleModel from "../article/article.model";
import AttachmentModel from "../attachment/attachment.model";
import RoleModel from "../role-permission/roles-permission.model";
import { ChangeUserPasswordDto } from "./dto/change-user-password.dto";
import type { FindUsersWithDto } from "./dto/find-users-with.dto";
import { createUserRepository, DB_TYPE } from "./repository/repository.factory";
import UserModel from "./user.model";

const userRepository = createUserRepository(DB_TYPE.MONGO);

export const UserService = {
    async changePassword(userId: string, payload: ChangeUserPasswordDto) {
        const user = await userRepository.findById(userId);
        appAssert(user, NOT_FOUND, "User not found");
        const isSamePassword = compareValue(payload.password, user.password);
        appAssert(!isSamePassword, CONFLICT, "New password cannot be the same as the current password");

        const updatedUser = await userRepository.updateUserPassword(userId, payload.password, {
            mustChangePassword: false,
        });

        if (!updatedUser) {
            throw new Error("Failed to change password");
        }

        return { message: "Password has been changed successfully" };
    },

    async findOne(id: string) {
        const user = await UserModel.findById(id)
            .populate({
                path: "role",
                select: "name permissions iconKey labelColor",
            })
            .populate({
                path: "profilePicture",
                select: "filename path mimeType size createdAt updatedAt",
            });
        appAssert(user, NOT_FOUND, "User not found");

        return user.omitPassword();
    },

    async updateMe(userId: string, payload: { name?: string; surname?: string; bio?: string }) {
        const { name, surname, bio } = payload;

        const user = await userRepository.updateMyUserData({
            id: userId,
            name,
            surname,
            bio,
        });
        appAssert(user, NOT_FOUND, "User not found");
    },

    async updateAvatar(userId: string, file: Express.Multer.File) {
        const user = await userRepository.findById(userId);
        appAssert(user, NOT_FOUND, "User not found");

        // Usuń stary avatar
        if (user.profilePicture) {
            const oldAvatar = await AttachmentModel.findById(user.profilePicture);
            if (oldAvatar) {
                if (fs.existsSync(oldAvatar.path)) fs.unlinkSync(oldAvatar.path);
                await AttachmentModel.deleteOne({ _id: oldAvatar._id });
            }
        }

        // Utwórz nowy attachment
        const attachment = await AttachmentModel.create({
            filename: file.originalname,
            path: file.path,
            mimeType: file.mimetype,
            size: file.size,
            uploadedBy: userId,
            ownerType: "User",
            ownerId: userId,
        });

        user.profilePicture = attachment._id;
        await user.save();

        return attachment;
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

        if (typeof isActive === "boolean") {
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
                select: "name ",
            })
            .populate({
                path: "profilePicture",
                select: "filename path mimeType size createdAt updatedAt",
            })
            .lean();
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
        const querydb = {
            ...constructSearchQuery(query),
            _id: { $in: favourites },
        };

        const favouriteArticles = await ArticleModel.find(querydb)
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
                { path: "createdBy", select: ["name", "surname"] },
            ])
            .skip(skip)
            .limit(pageSize);

        const totalFavouriteArticles = await ArticleModel.countDocuments(querydb);

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
