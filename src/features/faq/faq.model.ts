import mongoose, { Document, Schema, Types, model } from "mongoose";

export interface FaqDocument extends Document {
    _id: Types.ObjectId;
    title: string;
    description: string;
    slug: string;
    labelColor: string;
    isDefault: boolean;
    iconKey: string;
    status: string;
    createdBy: Types.ObjectId | null;
    createdAt: Date;
    updatedAt: Date;
}

const faqSchema = new Schema<FaqDocument>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        slug: { type: String, required: true, uniqure: true },
        labelColor: { type: String, required: true, default: "gray" },
        isDefault: { type: Boolean, default: false },
        iconKey: { type: String, required: true, default: "ScrollText" },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        status: {
            type: String,
            enum: ["draft", "approved"],
            default: "draft",
        },

        createdAt: { type: Date, default: Date.now },
    },

    {
        timestamps: true,
    }
);

const FaqModel = model<FaqDocument>("Faq", faqSchema);
export default FaqModel;
