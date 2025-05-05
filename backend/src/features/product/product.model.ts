import { Schema, model } from "mongoose";

const productSchema = new Schema({
    name: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    labelColor: { type: String, required: true, default: "#475569" },
    banner: {
        type: String,
        enum: [
            "blob",
            "steps",
            "circle",
            "biblioteka",
            "abstract",
            "abstract2",
            "abstract3",
            "abstract4",
            "default-banner",
        ],
        default: "default-banner",
    },
});

const ProductModel = model("Product", productSchema);
export default ProductModel;
