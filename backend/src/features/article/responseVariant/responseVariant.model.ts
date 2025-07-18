import { model, Schema, Types } from "mongoose";

const responseVariantSchema = new Schema({
    articleId: { type: Types.ObjectId, ref: "Article", required: true },
    version: { type: Number, required: true },
    variantName: { type: String },
    variantContent: { type: String, required: true },
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now },
    modifiedBy: { type: Types.ObjectId, ref: "User", default: null },
    modifiedAt: { type: Date, default: null },
});

const ResponseVariantModel = model("ResponseVariant", responseVariantSchema);
export default ResponseVariantModel;
