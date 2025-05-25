import mongoose from "mongoose";
import ArticleModel from "../article/article.model";
import ArticleViewModel from "./articleView.model";
import { ArticleViewsFilterDto } from "./dto/search-popular-articles.dto";

export const ArticleViewService = {
    async create(articleId: string, userId: string) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const today = new Date();
            const timezoneOffset = today.getTimezoneOffset();

            const localMidnight = new Date(today.getTime() - timezoneOffset * 60 * 1000);
            localMidnight.setUTCHours(0, 0, 0, 0);

            await ArticleViewModel.findOneAndUpdate(
                { articleId, userId, date: localMidnight },
                { $inc: { viewsCount: 1 } },
                { upsert: true, new: true, setDefaultsOnInsert: true, session }
            );

            await ArticleModel.findByIdAndUpdate(articleId, { $inc: { viewsCounter: 1 } }, { session });

            await session.commitTransaction();
            session.endSession();
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    },
    findPopular: async ({ startDate, endDate, limit, userId }: ArticleViewsFilterDto) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        const match: any = {
            date: { $gte: start, $lte: end },
        };

        if (userId) {
            match.userId = new mongoose.Types.ObjectId(userId);
        }

        return ArticleViewModel.aggregate([
            { $match: match },
            {
                $group: {
                    _id: "$articleId",
                    totalViews: { $sum: "$viewsCount" },
                },
            },
            { $sort: { totalViews: -1 } },
            {
                $lookup: {
                    from: "articles",
                    localField: "_id",
                    foreignField: "_id",
                    as: "article",
                },
            },
            { $unwind: "$article" },
            {
                $project: {
                    _id: 0,
                    articleId: "$_id",
                    title: "$article.title",
                    totalViews: 1,
                },
            },
            { $limit: limit },
        ]);
    },
};
