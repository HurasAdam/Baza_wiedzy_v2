import api from "@/config/api.client";

const baseUrl = "/projects";

const create = async (formData) => {
    return api.post(baseUrl, formData);
};

const find = async (params: URLSearchParams) => {
    return api.get(baseUrl, { params });
};
const findOne = async (id: string) => {
    return api.get(`${baseUrl}/${id}`);
};
const updateOne = async (id: string, formData) => {
    return api.put(`${baseUrl}/${id}`, formData);
};

export const projectApi = {
    create,
    find,
    findOne,
    updateOne,
};
