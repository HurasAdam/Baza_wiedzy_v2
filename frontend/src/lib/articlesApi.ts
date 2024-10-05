import API from "@/config/api.client"

export const getAllArticles = async() =>{
    return API.get('/articles');
}


export const createArticle = async({formData})=>{
    return API.post('/articles/create',formData)
}



export  const articlesApi ={
    getAllArticles,
    createArticle
} 