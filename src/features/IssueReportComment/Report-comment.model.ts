import mongoose, { Schema, model } from "mongoose";

const ReportCommentSchema = new Schema(
    {
        report: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "IssueReport",
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const ReportCommentModel = model("ReportComment", ReportCommentSchema);
export default ReportCommentModel;
