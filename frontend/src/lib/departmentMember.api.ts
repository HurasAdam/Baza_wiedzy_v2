import api from "@/config/api.client";

const baseUrl = "/departments";

const create = async (id, formData) => {
    return api.post(`${baseUrl}/${id}/members`, formData);
};

const find = async (id, params: URLSearchParams) => {
    return api.get(`${baseUrl}/${id}/members`, { params });
};
const findOne = async (departmentId: string, memberId: string) => {
    return api.get(`${baseUrl}/${departmentId}/members/${memberId}`);
};
const updateOne = async (departmentId: string, memberId: string, formData) => {
    return api.put(`${baseUrl}/${departmentId}/members/${memberId}`, formData);
};

export const departmentMemberApi = {
    create,
    find,
    findOne,
    updateOne,
};
