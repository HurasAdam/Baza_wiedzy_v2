import mongoose, { Document, Schema } from "mongoose";
import {
    WorkspacePermissions,
    WorkspacePermissionType,
    WorkspaceRoles,
    WorkspaceRoleType,
} from "../../enums/workspaceRole.enum";

export interface WorkspaceRoleDocument extends Document {
    name: WorkspaceRoleType;
    permissions: Array<WorkspacePermissionType>;
}

const workspaceRoleSchema = new Schema<WorkspaceRoleDocument>(
    {
        name: {
            type: String,
            enum: Object.values(WorkspaceRoles),
            required: true,
            unique: true,
        },
        permissions: {
            type: [String],
            enum: Object.values(WorkspacePermissions),
            required: true,
            default: function (this: WorkspaceRoleDocument) {
                return WorkspacePermissions[this.name];
            },
        },
    },
    {
        timestamps: true,
    }
);

const WorkspaceRoleModel = mongoose.model<WorkspaceRoleDocument>("WorkspaceRole", workspaceRoleSchema);
export default WorkspaceRoleModel;
