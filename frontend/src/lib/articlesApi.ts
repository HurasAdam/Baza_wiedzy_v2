import API from "@/config/api.client"

export const getAllArticles = async(searchParams) =>{


    const queryParams = new URLSearchParams();
    queryParams.append("page", searchParams.page);
    queryParams.append("title", searchParams.title );
    queryParams.append("author", searchParams.author );
  
    if(searchParams.limit !==null && searchParams.limit !==undefined){
      queryParams.append("limit",searchParams.limit);
    }
    if (searchParams.verified !== null && searchParams.verified !== undefined) {
      queryParams.append("verified", searchParams.verified);
  }
  
    if (searchParams.tags && searchParams.tags.length > 0) {
      searchParams.tags.forEach((tag) => {
        queryParams.append("tags", tag);
      });
    }





    return API.get(`/articles/?${queryParams}`);
}


export const createArticle = async({formData})=>{
    return API.post('/articles/create',formData)
}

export const getArticle = async({id}) =>{
    return API.get(`/articles/${id}`);
}




export  const articlesApi ={
    getAllArticles,
    createArticle,
    getArticle
} 