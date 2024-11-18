import API from "@/config/api.client"

const sendConversationReport = async({description,topic}) =>{

return API.post("/conversation-report/add",{description, topic}) 

}

const getCoversationReportStats = async()=>{
    return API.get("/user/statistics")
}


export const conversationReportApi ={
    sendConversationReport,
    getCoversationReportStats
}