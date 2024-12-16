import API from "@/config/api.client"

 const getAllProducts = async () =>{
    return API.get("/products");

}

const createProduct = async (formData) =>{
    console.log(formData)
    return API.post("/products/create",formData);

}

const deleteProduct = async (id) =>{
    return API.delete(`/products/product/${id}/delete`);
}

const getProduct = async(id)=>{
    return API.get(`/products/product/${id}`);
}

const updateProduct = async(productId,formData)=>{
    return API.put(`/products/product/${productId}/update`,formData);
}


export  const productsApi ={
    getAllProducts,
    createProduct,
    deleteProduct,
    getProduct,
    updateProduct
} 