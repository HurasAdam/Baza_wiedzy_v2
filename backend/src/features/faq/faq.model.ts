import mongoose, { Schema, model } from "mongoose";

const faqSchema = new Schema(
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

const FaqModel = model("Faq", faqSchema);
export default FaqModel;
