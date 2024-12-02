import API from "@/config/api.client"

export const getConversationTopics = async(searchParams) =>{


    const queryParams = new URLSearchParams();

    queryParams.append("title", searchParams.title );
 


  


    return API.get(`/conversation-topics/?${queryParams}`);
}





export  const conversationTopicApi ={
    getConversationTopics
} 