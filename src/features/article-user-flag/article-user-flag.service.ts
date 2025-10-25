import ArticleUserFlagModel from "./article-user-flag.model";

export const ArticleUserFlagService = {
    async create(body, userId) {
        const { articleId, flagId } = body;
        await ArticleUserFlagModel.create({ articleId, flagId, userId });
    },

    async findOne(articleId: string, userId: string) {
        const userFlag = await ArticleUserFlagModel.findOne({ articleId, userId })
            .populate<{ flagId: { _id: string; name: string; color: string } }>("flagId", "name color")
            .lean();

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
};
