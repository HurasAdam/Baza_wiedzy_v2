import { PermissionType, Roles, RoleType, Permissions } from "../../enums/role.enum";
import mongoose, { Schema, Document } from "mongoose";

export interface RoleDocument extends Document {
    name: RoleType;
    permissions: Array<PermissionType>;
}

const roleSchema = new Schema<RoleDocument>(
    {
        name: {
            type: String,
            enum: Object.values(Roles),
            required: true,
            unique: true,
        },
        permissions: {
            type: [String],
            enum: Object.values(Permissions),
            required: true,
            default: function (this: RoleDocument) {
                return Permissions[this.name] || [];
            },
        },
    },
    {
        timestamps: true,
    }
);

const RoleModel = mongoose.model<RoleDocument>("Role", roleSchema);
export default RoleModel;
