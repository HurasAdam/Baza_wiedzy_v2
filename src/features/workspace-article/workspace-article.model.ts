import { Schema, model } from "mongoose";

const WorkspaceArticleSchema = new Schema(
    {
        title: { type: String, required: true, trim: true },
        workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace", required: true },
        folderId: { type: Schema.Types.ObjectId, ref: "WorkspaceFolder", required: true },
        createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
        updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

export const WorkspaceArticleModel = model("WorkspaceArticle", WorkspaceArticleSchema);
