import { Schema,model } from "mongoose";

const productSchema= new Schema({
    name:{type:String, required:true},
    createdBy:{type: Schema.Types.ObjectId, ref: "User", required:true}
})

const ProductModel = model("Product",productSchema);
export default ProductModel;