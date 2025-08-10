import mongoose, { Document, Schema, Types } from "mongoose";

export interface IFaqItem extends Document {
    faqId: Types.ObjectId;
    question: string;
    answer: string;
    createdBy: Types.ObjectId;
    modifiedBy?: Types.ObjectId | null;
    createdAt: Date;
    updatedAt: Date;
}

const faqItemSchema = new Schema<IFaqItem>(
    {
        faqId: { type: Schema.Types.ObjectId, ref: "Faq", required: true },
        question: { type: String, required: true },
        answer: { type: String, required: true },
        createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
        modifiedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    },
    { timestamps: true }
);

export const FaqItemModel = mongoose.model<IFaqItem>("FaqItem", faqItemSchema);
