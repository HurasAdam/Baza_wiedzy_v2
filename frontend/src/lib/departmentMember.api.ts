import api from "@/config/api.client";

const baseUrl = "/departments";

const create = async (id, formData) => {
    return api.post(`${baseUrl}/${id}/members`, formData);
};

const find = async (id, params: URLSearchParams) => {
    return api.get(`${baseUrl}/${id}/members`, { params });
};
const findOne = async (id: string) => {
    return api.get(`${baseUrl}/${id}`);
};
const updateOne = async (id: string, formData) => {
    return api.put(`${baseUrl}/${id}`, formData);
};

export const departmentMemberApi = {
    create,
    find,
    findOne,
    updateOne,
};
