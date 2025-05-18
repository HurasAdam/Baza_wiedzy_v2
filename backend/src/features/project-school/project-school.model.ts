import { Schema, model } from "mongoose";

const projectSchoolSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        adres: { type: String, required: true, trim: true },
        email: { type: String, unique: true, required: true, trim: true, lowercase: true },
        project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
        szId: { type: String, required: true, unique: true },
        phone: { type: String, required: true },
    },

    {
        timestamps: true,
    }
);

const ProjectSchoolModel = model("ProjectSchool", projectSchoolSchema);
export default ProjectSchoolModel;
