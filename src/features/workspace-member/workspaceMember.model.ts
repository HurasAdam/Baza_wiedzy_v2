import mongoose, { Document, Schema } from "mongoose";

export interface WorkspaceMemberDocument extends Document {
    userId: mongoose.Types.ObjectId;
    workspaceId: mongoose.Types.ObjectId;
    permissions: WorkspacePermissions;
    joinedAt: Date;
}

export interface WorkspacePermissions {
    addFolder: boolean;
    editFolder: boolean;
    deleteFolder: boolean;
    addArticle: boolean;
    editArticle: boolean;
    deleteArticle: boolean;
    addMember: boolean;
    removeMember: boolean;
    editWorkspace: boolean;
}

export const defaultPermissions: WorkspacePermissions = {
    addFolder: false,
    editFolder: false,
    deleteFolder: false,
    addArticle: false,
    editArticle: false,
    deleteArticle: false,
    addMember: false,
    removeMember: false,
    editWorkspace: false,
};

const memberSchema = new Schema<WorkspaceMemberDocument>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        workspaceId: {
            type: Schema.Types.ObjectId,
            ref: "Workspace",
            required: true,
        },
        permissions: {
            type: Object,
            default: defaultPermissions,
        },

        joinedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

const WorkspaceMemberModel = mongoose.model<WorkspaceMemberDocument>("WorkspaceMember", memberSchema);
export default WorkspaceMemberModel;
