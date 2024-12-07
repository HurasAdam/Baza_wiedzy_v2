import API from "@/config/api.client"

export const getConversationTopics = async(searchParams) =>{


    const queryParams = new URLSearchParams();

    queryParams.append("title", searchParams.title );



          queryParams.append("product", searchParams.product);
  
 
    return API.get(`/conversation-topics/?${queryParams}`);
}

export const createConversationTopic = async(formData) =>{

    return API.post(`/conversation-topics/create`,formData);
}

 




export  const conversationTopicApi ={
    getConversationTopics,
    createConversationTopic
} 