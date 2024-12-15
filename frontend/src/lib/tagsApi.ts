import API from "@/config/api.client"

export const getAllTags = async() =>{
    return API.get('/tags');
}


export const createTag = async(tagForm) =>{
    return API.post('/tags/create',tagForm);
}

export const deleteTag = async(id) =>{
    return API.delete(`/tags/tag/${id}/delete`);
}

export const getTag = async({id}) =>{
    return API.get(`/tags/tag/${id}`);
}

export const updateTag = async({id,formData}) =>{
    return API.put(`/tags/tag/${id}/update`,formData);
}

export  const tagsApi ={
    getAllTags,
    createTag,
    deleteTag,
    getTag,
    updateTag
} 