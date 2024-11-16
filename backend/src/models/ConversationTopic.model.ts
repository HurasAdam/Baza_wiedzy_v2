import { Schema,model } from "mongoose";

const conversationTopicSchema= new Schema({
    title:{type:String, required:true},
    createdBy:{type: Schema.Types.ObjectId, ref: "User", required:true}
})

const ConversationTopicModel = model("ConversationTopic",conversationTopicSchema);
export default ConversationTopicModel;