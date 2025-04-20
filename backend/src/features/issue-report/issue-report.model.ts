import { Schema, model } from "mongoose";

const issueReportSchema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        user: { type: Schema.Types.ObjectId, ref: "User" },
        status: {
            type: String,
            enum: ["pending", "in-progress", "resolved"],
            default: "pending",
        },
        isNew: {
            type: Boolean,
            default: true,
        },

        createdAt: { type: Date, default: Date.now },
        type: {
            type: String,
            enum: ["proposal", "bug"],
            required: true,
        },
        category: {
            type: String,
            enum: ["Interfejs(UI)", "Backend", "Wydajność", "Inne"],
            required: true,
        },
    },

    {
        timestamps: true,
    }
);

const IssueReportModel = model("IssueReport", issueReportSchema);
export default IssueReportModel;
