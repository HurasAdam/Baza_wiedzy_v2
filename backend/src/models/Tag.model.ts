import { Schema,model } from "mongoose";

const tagSchema= new Schema({
    name:{type:String, required:true},
    createdBy:{type: Schema.Types.ObjectId, ref: "User", required:true}
})

const TagModel = model("Tag",tagSchema);
export default TagModel;