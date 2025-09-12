import { model, Schema } from "mongoose";

const articleHistorySchema = new Schema(
    {
        articleId: { type: Schema.Types.ObjectId, ref: "Article", required: true },
        eventType: {
            type: String,
            required: true,
            enum: ["created", "updated", "trashed", "restored", "verified", "unverified"],
        },
        changes: [
            {
                field: { type: String, required: true },
                oldValue: { type: Schema.Types.Mixed },
                newValue: { type: Schema.Types.Mixed, required: true },
            },
        ],
        createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
        updatedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

const ArticleHistoryModel = model("ArticleHistory", articleHistorySchema);
export default ArticleHistoryModel;
