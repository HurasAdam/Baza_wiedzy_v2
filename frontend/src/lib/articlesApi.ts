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


export const verifyArticle = async({id,isVerified})=>{
  return API.post(`/articles/article/${id}/verify`,{isVerified})
}

export const markArticleAsFavourite = async({id})=>{
  return API.post(`/articles/article/${id}/markAsFavourite`)
}

export const updateArticle = async({id,formData})=>{

  console.log("ID")
  console.log(id)
  console.log("formData")
  console.log(formData)
  return API.put(`/articles/article/${id}/update`,formData)
}

export const deleteArticle = async({id})=>{
  return API.delete(`/articles/article/${id}/delete`)
}


export  const articlesApi ={
    getAllArticles,
    createArticle,
    getArticle,
    verifyArticle,
    markArticleAsFavourite,
    deleteArticle,
    updateArticle
} 