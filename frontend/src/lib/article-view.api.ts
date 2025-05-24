import api from "@/config/api.client";

const baseUrl = "/article-views" as const;
const create = async (id: string) => {
    return api.post(`${baseUrl}/${id}/increment`, {});
};

export const articleViewApi = {
    create,
};
