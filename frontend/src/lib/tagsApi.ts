import API from "@/config/api.client"

export const getAllTags = async() =>{
    return API.get('/tags');
}





export  const tagsApi ={
    getAllTags
} 