import { Document, Schema, Types, model } from "mongoose";

export interface WorkspaceFolderDocument extends Document {
    workspaceId: Types.ObjectId;
    name: string;
    createdBy: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const workspaceFolderSchema = new Schema<WorkspaceFolderDocument>(
    {
        workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace", required: true },
        name: { type: String, required: true },

        createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
);

export const WorkspaceFolderModel = model<WorkspaceFolderDocument>("WorkspaceFolder", workspaceFolderSchema);
