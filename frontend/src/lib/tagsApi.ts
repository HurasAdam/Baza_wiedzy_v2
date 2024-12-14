import API from "@/config/api.client"

export const getAllTags = async() =>{
    return API.get('/tags');
}


export const createTag = async(tagForm) =>{
    return API.post('/tags/create',tagForm);
}


export  const tagsApi ={
    getAllTags,
    createTag
} 