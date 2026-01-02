import { Types } from "mongoose";
import { CONFLICT, NOT_FOUND } from "../../constants/http";
import appAssert from "../../utils/appAssert";
import ArticleUserFlagModel from "../article-user-flag/article-user-flag.model";
import FlagModel from "./flag.model";

export const FlagService = {
    async create(userId: string, body: { name: string; color: string }) {
        const { name, color } = body;
        const newFlag = await FlagModel.create({ name, color, createdBy: userId });
        return newFlag;
    },
    async findMyFlags(userId: string) {
        return await FlagModel.find({ createdBy: userId }).lean();
    },

    async findOne(userId: string, flagId: string) {
        return await FlagModel.findOne({ createdBy: userId, _id: flagId }).lean();
    },

    async findMyFlagsWithStats(userId: string) {
        const userObjectId = new Types.ObjectId(userId);

        return FlagModel.aggregate([
            {
                $match: {
                    createdBy: userObjectId,
                },
            },
            {
                $lookup: {
                    from: "articleuserflags",
                    let: { flagId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [{ $eq: ["$flagId", "$$flagId"] }, { $eq: ["$userId", userObjectId] }],
                                },
                            },
                        },
                    ],
                    as: "articles",
                },
            },
            {
                $addFields: {
                    articlesCount: { $size: "$articles" },
                },
            },
            {
                $project: {
                    articles: 0,
                    __v: 0,
                },
            },
        ]);
    },
    async updateOne(userId: string, flagId: string, payload: { name?: string; color?: string }) {
        const flag = await FlagModel.findOne({
            _id: flagId,
            createdBy: userId,
        });

        appAssert(flag, NOT_FOUND, "Flag not found");

        if (payload.name) {
            const existingFlag = await FlagModel.findOne({
                _id: { $ne: flagId },
                name: payload.name,
                createdBy: userId,
            });

            appAssert(!existingFlag, CONFLICT, "Flag with this name already exists");
        }

        flag.name = payload.name ?? flag.name;
        flag.color = payload.color ?? flag.color;

        await flag.save();

        return flag;
    },
    async deleteOne(userId: string, flagId: string) {
        const flag = await FlagModel.findOne({
            _id: flagId,
            createdBy: userId,
        });

        appAssert(flag, NOT_FOUND, "Flag not found");

        const isUsed = await ArticleUserFlagModel.exists({
            flagId,
            userId,
        });

        appAssert(!isUsed, CONFLICT, "Cannot delete flag that is used to mark articles");

        await FlagModel.findByIdAndDelete(flagId);
        return;
    },
};
