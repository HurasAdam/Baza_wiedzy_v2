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

export const getConversationTopic = async({id}) =>{
    return API.get(`/conversation-topics/${id}`);
}
 
export const updateConversationTopic = async({id,formData})=>{

    return API.put(`/conversation-topics/topic/${id}/update`,formData)
  }

  export const deleteConversationTopic = async(id)=>{

    return API.delete(`/conversation-topics/topic/${id}/delete`)
  }





export  const conversationTopicApi ={
    getConversationTopics,
    createConversationTopic,
    getConversationTopic,
    updateConversationTopic,
    deleteConversationTopic
} 