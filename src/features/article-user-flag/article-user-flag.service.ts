import { BAD_REQUEST, CONFLICT, NOT_FOUND } from "../../constants/http";
import appAssert from "../../utils/appAssert";
import FlagModel from "../flag/flag.model";
import ArticleUserFlagModel from "./article-user-flag.model";

export const ArticleUserFlagService = {
    async create(userId: string, body: { articleId: string; flagId: string }) {
        const { articleId, flagId } = body;

        appAssert(flagId, BAD_REQUEST, "flagId is required");

        const flagExists = await FlagModel.exists({ _id: flagId });
        appAssert(flagExists, NOT_FOUND, "Flag not found");

        const existing = await ArticleUserFlagModel.findOne({ articleId, userId, flagId });
        appAssert(!existing, CONFLICT, "Article already flagged with this flag");

        const newFlag = await ArticleUserFlagModel.create({ articleId, flagId, userId });

        return newFlag;
    },

    async findOne(articleId: string, userId: string) {
        const userFlag = await ArticleUserFlagModel.findOne({ articleId, userId })
            .populate<{ flagId: { _id: string; name: string; color: string } }>("flagId", "name color")
            .lean();

        if (!userFlag) {
            const allUserFlags = await ArticleUserFlagModel.find({ userId }).populate("flagId").lean();
        }

        return {
            selectedFlag: userFlag?.flagId
                ? {
                      _id: userFlag.flagId._id,
                      name: userFlag.flagId.name,
                      color: userFlag.flagId.color,
                  }
                : null,
        };
    },
    async unflagOne(articleId, userId) {
        return await ArticleUserFlagModel.findOneAndDelete({ articleId, userId });
    },

    async updateFlag(articleId: string, userId: string, flagId: string) {
        appAssert(flagId, BAD_REQUEST, "flagId is required");

        const flagExists = await FlagModel.exists({ _id: flagId });
        appAssert(flagExists, NOT_FOUND, "Flag not found");

        const updated = await ArticleUserFlagModel.findOneAndUpdate(
            { articleId, userId },
            { flagId },
            { new: true, upsert: true }
        )
            .populate<{ flagId: { _id: string; name: string; color: string } }>("flagId", "name color")
            .lean();

        return {
            selectedFlag: updated.flagId
                ? {
                      _id: updated.flagId._id,
                      name: updated.flagId.name,
                      color: updated.flagId.color,
                  }
                : null,
        };
    },
};
