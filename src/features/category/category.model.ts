import { model, Schema } from "mongoose";

const categorySchema = new Schema(
    {
        name: { type: String, required: true },
        createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
        updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    },
    {
        timestamps: true,
    }
);

const CategoryModel = model("Category", categorySchema);
export default CategoryModel;
