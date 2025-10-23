import { model, Schema } from "mongoose";

const articleUserFlagSchema = new Schema(
    {
        articleId: { type: Schema.Types.ObjectId, ref: "Article", required: true },
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        flagId: { type: Schema.Types.ObjectId, ref: "Flag", required: true },
    },
    { timestamps: true }
);

articleUserFlagSchema.index({ articleId: 1, userId: 1, flagId: 1 }, { unique: true });

const ArticleUserFlagModel = model("ArticleUserFlag", articleUserFlagSchema);
export default ArticleUserFlagModel;
