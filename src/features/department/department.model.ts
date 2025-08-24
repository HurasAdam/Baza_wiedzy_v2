import { model, Schema } from "mongoose";

const departmentSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const DepartmentModel = model("Department", departmentSchema);

export default DepartmentModel;
