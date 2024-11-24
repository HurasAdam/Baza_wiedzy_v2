import API from "@/config/api.client"

const sendConversationReport = async({description,topic}) =>{

return API.post("/conversation-report/add",{description, topic}) 

}

const getCoversationReportStats = async()=>{
    return API.get("/user/statistics")
}


const getConversationReportValues = async()=>{
    return API.get("/conversation-report")
}


export const conversationReportApi ={
    sendConversationReport,
    getCoversationReportStats,
    getConversationReportValues
}