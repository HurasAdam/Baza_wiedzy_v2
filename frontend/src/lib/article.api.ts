import api from "@/config/api.client";
import { crurl } from "@/utils/crurl";

const baseUrl = "/articles";

export const getAllArticles = (params: URLSearchParams) => {
    return api.get(baseUrl, { params });
};

export const getLatestArticles = (params: URLSearchParams) => {
    return api.get(crurl(baseUrl, "latest"), { params });
};

export const getPopularArticles = (params: URLSearchParams) => {
    return api.get(crurl(baseUrl, "popular"), { params });
};

export const getAllTrashedArticles = (params: URLSearchParams) => {
    return api.get(crurl(baseUrl, "trashed"), { params });
};

export const createArticle = ({ formData }) => {
    return api.post(baseUrl, formData);
};

export const getArticle = ({ id }) => {
    return api.get(crurl(baseUrl, id));
};

export const getArticleHistory = ({ id }) => {
    return api.get(crurl(baseUrl, id, "history"));
};

export const verifyArticle = ({ id, isVerified }) => {
    return api.post(crurl(baseUrl, id, "verify"), { isVerified });
};

export const markArticleAsFavourite = ({ id }) => {
    return api.post(crurl(baseUrl, id, "markAsFavourite"));
};

export const updateArticle = ({ id, formData }) => {
    return api.put(crurl(baseUrl, id), formData);
};

export const deleteArticle = ({ id }) => {
    return api.delete(crurl(baseUrl, id));
};

export const trashArticle = ({ id }) => {
    return api.put(crurl(baseUrl, id, "trash"));
};

export const restoreArticle = ({ id }) => {
    return api.put(crurl(baseUrl, id, "restore"));
};

export const getUsersArticleStats = (params: URLSearchParams) => {
    // startDate and endDate in params
    return api.get("/users/article-statistics", { params });
};

export const getUsersChangedArticleStats = (params: URLSearchParams) => {
    // startDate and endDate in params
    return api.get("/users/change-statistics", { params });
};

const getArticlesCreatedByUser = ({ userId, params }) => {
    // startDate, endDate, limit and page in searchParams
    return api.get(crurl(baseUrl, "userArticles", userId), { params });
};

const getArticlesHistoryByUser = ({ userId, params }) => {
    // startDate and endDate in params
    return api.get(crurl(baseUrl, "userHistory", userId), { params });
};
const getArticleHistoryItem = ({ id }) => {
    return api.get(crurl(baseUrl, "history", id));
};

export const articleApi = {
    getAllArticles,
    createArticle,
    getArticle,
    verifyArticle,
    markArticleAsFavourite,
    deleteArticle,
    updateArticle,
    trashArticle,
    getAllTrashedArticles,
    getArticleHistory,
    restoreArticle,
    getUsersArticleStats,
    getLatestArticles,
    getPopularArticles,
    getArticlesCreatedByUser,
    getArticlesHistoryByUser,
    getUsersChangedArticleStats,
    getArticleHistoryItem,
};
