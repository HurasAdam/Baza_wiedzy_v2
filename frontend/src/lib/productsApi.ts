import API from "@/config/api.client";

const getAllProducts = () => {
    return API.get("/products");
};

const createProduct = (formData) => {
    return API.post("/products/create", formData);
};

const deleteProduct = (id: string) => {
    return API.delete(`/products/product/${id}/delete`);
};

const getProduct = (id: string) => {
    return API.get(`/products/product/${id}`);
};

const updateProduct = (productId: string, formData) => {
    return API.put(`/products/product/${productId}/update`, formData);
};

export const productsApi = {
    getAllProducts,
    createProduct,
    deleteProduct,
    getProduct,
    updateProduct,
};
