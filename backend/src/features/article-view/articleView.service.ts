import mongoose from "mongoose";
import ArticleModel from "../article/article.model";
import ArticleViewModel from "./articleView.model";

export const ArticleViewService = {
    async create(articleId: string, userId: string) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            await ArticleViewModel.findOneAndUpdate(
                { articleId, date: today },
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
};
