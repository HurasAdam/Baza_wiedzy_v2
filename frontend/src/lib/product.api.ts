import api from "@/config/api.client";
import { crurl } from "@/utils/crurl";

const baseUrl = "/products";

const find = (params: URLSearchParams) => {
    return api.get(baseUrl, { params });
};

const create = (data) => {
    return api.post(baseUrl, data);
};

const remove = (id: string) => {
    return api.delete(crurl(baseUrl, id));
};

const findOne = (id: string) => {
    return api.get(crurl(baseUrl, id));
};

const updateOne = (id: string, data) => {
    return api.put(crurl(baseUrl, id), data);
};

export const productApi = {
    find,
    create,
    remove,
    findOne,
    updateOne,
};
