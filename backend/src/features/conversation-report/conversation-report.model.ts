import { Schema, model } from "mongoose";

const conversationReportSchema = new Schema(
    {
        topic: {
            type: Schema.Types.ObjectId,
            ref: "ConversationTopic",
            required: true,
        },
        type: {
            type: String,
            enum: ["call", "message"],
            required: true,
        },
        description: {
            type: String,
            default: "",
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const ConversationReportModel = model("ConversationReport", conversationReportSchema);
export default ConversationReportModel;
