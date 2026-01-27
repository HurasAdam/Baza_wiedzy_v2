import { model, Schema } from "mongoose";

const articleHistorySchema = new Schema(
    {
        articleId: { type: Schema.Types.ObjectId, ref: "Article", required: true },
        eventType: {
            // <- pojedynczy event
            type: String,
            required: true,
            enum: [
                "created",
                "updated",
                "trashed",
                "restored",
                "verified",
                "unverified",
                "statusChanged",
                "expired",
                "attachmentAdded",
                "attachmentRemoved",
            ],
        },
        changes: [
            {
                field: { type: String, required: true },
                oldValue: { type: Schema.Types.Mixed },
                newValue: { type: Schema.Types.Mixed, required: true },
            },
        ],
        statusChange: {
            from: { type: String, enum: ["pending", "approved", "rejected", "draft"], required: false },
            to: { type: String, enum: ["pending", "approved", "rejected", "draft"], required: false },
        },
        createdBy: { type: Schema.Types.ObjectId, ref: "User", required: false },
        updatedAt: { type: Date, default: Date.now },
        isSystem: { type: Boolean, default: false }, // NEW
    },
    { timestamps: true }
);

const ArticleHistoryModel = model("ArticleHistory", articleHistorySchema);
export default ArticleHistoryModel;
