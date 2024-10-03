import API from "@/config/api.client"

export const getAllArticles = async() =>{
    return API.get('/articles');
}



export  const articlesApi ={
    getAllArticles
} 