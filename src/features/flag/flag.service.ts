import { Types } from "mongoose";
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
};
