import mongoose, { Schema, model } from "mongoose";
import { validBugCategories, validProposalCategories, validTypes } from "./dto/create-issue.dto";

const issueReportSchema = new Schema(
    {
        ticketNumber: { type: String, unique: true, index: true },

        title: { type: String, required: true, trim: true, maxlength: 120 },

        type: {
            type: String,
            enum: validTypes,
            required: true,
        },

        category: {
            slug: {
                type: String,
                required: true,
            },
            label: {
                type: String,
                required: true,
                enum: [...validBugCategories, ...validProposalCategories],
            },
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
