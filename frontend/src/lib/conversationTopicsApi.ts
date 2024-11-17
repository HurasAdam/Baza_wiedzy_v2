import API from "@/config/api.client"

export const getConversationTopics = async() =>{
    return API.get('/conversation-topics');
}





export  const conversationTopicApi ={
    getConversationTopics
} 