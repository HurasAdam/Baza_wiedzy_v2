import api from "@/config/api.client";

const baseUrl = "/projects";

const create = async (id: string, formData) => {
    console.log(formData, "XD");
    return api.post(`${baseUrl}/${id}/schools`, formData);
};

const find = async (projectId: string, params: URLSearchParams) => {
    return api.get(`${baseUrl}/${projectId}/schools`, { params });
};
const findOne = async (projectId: string, schoolId: string) => {
    return api.get(`${baseUrl}/${projectId}/schools/${schoolId}`);
};
const updateOne = async (projectId: string, schoolId: string, formData) => {
    return api.put(`${baseUrl}/${projectId}/schools/${schoolId}`, formData);
};
const deleteOne = async (projectId: string, schoolId: string) => {
    return api.delete(`${baseUrl}/${projectId}/schools/${schoolId}`);
};

export const projectSchoolApi = {
    create,
    find,
    findOne,
    updateOne,
    deleteOne,
};
