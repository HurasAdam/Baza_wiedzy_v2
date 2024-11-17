import { OK } from "../constants/http";
import { addConversationReport } from "../services/conversationReport.service";
import catchErrors from "../utils/catchErrors";
import { newConversationReportSchema } from "./conversationReport.schema";

export const addConversationReportHandler = catchErrors(
    async(req,res)=>{
        const request = newConversationReportSchema.parse(req.body);
        const {userId} = req
        const newTag= await addConversationReport({request, userId});

console.log(newTag);
return res.status(OK).json(newTag)

    }
)
