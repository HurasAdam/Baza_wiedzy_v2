import API from "@/config/api.client"

 const getAllProducts = async () =>{
    return API.get("/products");

}


export  const productsApi ={
    getAllProducts
} 