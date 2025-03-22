import API from "@/config/api.client";

const getAllProducts = () => {
    return API.get("/products");
};

const createProduct = (formData) => {
    return API.post("/products", formData);
};

const deleteProduct = (id: string) => {
    return API.delete(`/products/${id}`);
};

const getProduct = (id: string) => {
    return API.get(`/products/${id}`);
};

const updateProduct = (productId: string, formData) => {
    return API.put(`/products/${productId}`, formData);
};

export const productsApi = {
    getAllProducts,
    createProduct,
    deleteProduct,
    getProduct,
    updateProduct,
};
