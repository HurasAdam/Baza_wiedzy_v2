import api from "@/config/api.client";
import { crurl } from "@/utils/crurl";

const baseUrl = "/tags";

export const findAll = () => {
    return api.get(baseUrl);
};

export const findOne = (id: string) => {
    return api.get(crurl(baseUrl, id));
};

export const create = (tag) => {
    return api.post(baseUrl, tag);
};

export const remove = (id: string) => {
    return api.delete(crurl(baseUrl, id));
};

export const updateOne = ({ id, formData }) => {
    return api.put(crurl(baseUrl, id), formData);
};

export const tagApi = {
    findAll,
    create,
    remove,
    findOne,
    updateOne,
};
