import mongoose, { Schema, model } from "mongoose";

const departmentMemberSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        surname: { type: String, required: true, trim: true },
        email: { type: String, unique: true, required: true, trim: true, lowercase: true },
        department: { type: String, required: true },
        phone: { type: String, required: true },
    },

    {
        timestamps: true,
    }
);

const DepartmentMemberModel = model("DepartmentMember", departmentMemberSchema);
export default DepartmentMemberModel;
