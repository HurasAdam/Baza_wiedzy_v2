import { Schema,model } from "mongoose";

const productSchema= new Schema({
    name:{type:String, required:true},
    createdBy:{type: Schema.Types.ObjectId, ref: "User", required:true},
    labelColor:{type:String, required:true, default:"#475569"}
})

const ProductModel = model("Product",productSchema);
export default ProductModel;