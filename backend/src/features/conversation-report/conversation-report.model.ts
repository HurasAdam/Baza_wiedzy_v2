import { Schema,model } from "mongoose";

const covnersationReportSchema= new Schema({
    topic:{type:Schema.Types.ObjectId, ref:"ConversationTopic",required:true},
    description:{type:String},
    createdBy:{type: Schema.Types.ObjectId, ref: "User", required:true}
},{
    timestamps:true
})

const ConversationReportModel = model("ConversationReport",covnersationReportSchema);
export default ConversationReportModel;