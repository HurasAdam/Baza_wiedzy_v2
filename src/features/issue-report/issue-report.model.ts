import mongoose, { Schema, model } from "mongoose";

const issueReportSchema = new Schema(
    {
        title: { type: String, required: true, trim: true, kMaxLength: 120 },
        type: {
            type: String,
            enum: ["proposal", "bug"],
            required: true,
        },
        category: {
            type: String,
            enum: ["Interfejs (UI)", "Backend", "Wydajność", "Inne"],
            required: true,
        },

        currentBehavior: {
            type: String,
            required: true,
            trim: true,
        },
        expectedBehavior: {
            type: String,
            required: true,
            trim: true,
        },
        reproductionSteps: {
            type: [String],
            default: [],
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        status: {
            type: String,
            enum: ["open", "resolved", "closed"],
            default: "open",
        },
        isUnread: {
            type: Boolean,
            default: true,
        },

        createdAt: { type: Date, default: Date.now },
    },

    {
        timestamps: true,
    }
);

const IssueReportModel = model("IssueReport", issueReportSchema);
export default IssueReportModel;
