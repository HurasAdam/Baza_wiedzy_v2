import api from "@/config/api.client";
import { crurl } from "@/utils/crurl";

const baseUrl = "/conversation-topics";

export const find = (params: URLSearchParams) => {
    // title, produst params
    return api.get(baseUrl, { params });
};

export const create = (data) => {
    return api.post(baseUrl, data);
};

export const findOne = ({ id }) => {
    return api.get(crurl(baseUrl, id));
};

export const update = ({ id, formData }) => {
    return api.put(crurl(baseUrl, id), formData);
};

export const remove = (id: string) => {
    return api.delete(crurl(baseUrl, id));
};

export const conversationTopicApi = {
    find,
    create,
    findOne,
    update,
    remove,
};
