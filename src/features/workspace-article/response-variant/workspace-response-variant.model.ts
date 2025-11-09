import { Schema, model } from "mongoose";

const WorkspaceResponseVariantSchema = new Schema(
    {
        articleId: {
            type: Schema.Types.ObjectId,
            ref: "WorkspaceArticle",
            required: true,
        },
        variantName: {
            type: String,
            required: true,
            trim: true,
        },
        variantContent: {
            type: String,
            required: true,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        updatedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true,
    }
);

export const WorkspaceResponseVariantModel = model("WorkspaceResponseVariant", WorkspaceResponseVariantSchema);
