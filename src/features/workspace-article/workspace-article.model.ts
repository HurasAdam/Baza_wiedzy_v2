import { Schema, Types, model } from "mongoose";

export type Marker = "red" | "yellow" | "green" | "blue";

export interface WorkspaceArticle {
    title: string;
    workspaceId: Types.ObjectId;
    folderId: Types.ObjectId;
    marker: Marker | null;
    createdBy: Types.ObjectId;
    updatedBy?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const WorkspaceArticleSchema = new Schema<WorkspaceArticle>(
    {
        title: { type: String, required: true, trim: true },
        workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace", required: true },
        folderId: { type: Schema.Types.ObjectId, ref: "WorkspaceFolder", required: true },
        marker: { type: String, enum: ["red", "yellow", "green", "blue"], default: null },
        createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
        updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

export const WorkspaceArticleModel = model("WorkspaceArticle", WorkspaceArticleSchema);
