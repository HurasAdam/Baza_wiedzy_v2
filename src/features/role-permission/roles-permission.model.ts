import { PermissionType, Roles, RoleType, Permissions } from "../../enums/role.enum";
import mongoose, { Schema, Document } from "mongoose";

export interface RoleDocument extends Document {
    name: RoleType;
    permissions: Array<PermissionType>;
    iconKey: string;
    labelColor: string;
}

const roleSchema = new Schema<RoleDocument>(
    {
        name: {
            type: String,
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
        iconKey: {
            type: String,

            required: true,
            default: "FaEye",
        },
        labelColor: {
            type: String,

            required: true,
            default: "blue",
        },
    },
    {
        timestamps: true,
    }
);

const RoleModel = mongoose.model<RoleDocument>("Role", roleSchema);
export default RoleModel;
