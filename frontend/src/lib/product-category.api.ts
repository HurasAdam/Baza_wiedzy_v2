import api from "@/config/api.client";
import { crurl } from "@/utils/crurl";

const baseUrl = "/categories";

const find = (params: URLSearchParams) => {
    return api.get(baseUrl, { params });
};

const create = (categoryId, data) => {
    return api.post(`${baseUrl}/${categoryId}/create`, data);
};

const remove = (id: string) => {
    return api.delete(crurl(baseUrl, id));
};

const findOne = (id: string) => {
    return api.get(crurl(baseUrl, id));
};
const findByProduct = (params: URLSearchParams, id: string) => {
    return api.get(crurl(`${baseUrl}/product`, id), { params });
};

const updateOne = (id: string, data) => {
    return api.put(crurl(baseUrl, id), data);
};
const deleteOne = (id: string) => {
    return api.delete(crurl(baseUrl, id));
};

export const productCategoryApi = {
    find,
    create,
    remove,
    findOne,
    updateOne,
    findByProduct,
    deleteOne,
};
