import api from "@/config/api.client";

const baseUrl = "/article-views" as const;
const create = async (id: string) => {
    return api.post(`${baseUrl}/${id}/increment`, {});
};

const find = async (params) => {
    return api.get(`${baseUrl}/popular`, { params });
};

export const articleViewApi = {
    create,
    find,
};
