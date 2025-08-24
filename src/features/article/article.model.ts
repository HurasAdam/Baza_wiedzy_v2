import { model, Schema } from "mongoose";

const articleSchema = new Schema(
    {
        title: { type: String, required: true },
        employeeDescription: { type: String, required: true },
        tags: [{ type: Schema.Types.ObjectId, ref: "Tag", required: true }],
        isVerified: { type: Boolean, required: true, default: false },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected", "draft"],
            required: true,
            default: "draft",
        },
        rejectionReason: { type: String, default: null, required: false },
        rejectedBy: { type: Schema.Types.ObjectId, ref: "User", default: null, required: false },
        createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },

        verifiedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
        viewsCounter: { type: Number, default: 0 },
        isTrashed: { type: Boolean, default: false },
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    },
    {
        timestamps: true,
    }
);

const ArticleModel = model("Article", articleSchema);
export default ArticleModel;
