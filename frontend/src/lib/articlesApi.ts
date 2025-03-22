import API from "@/config/api.client";

export const getAllArticles = (params: URLSearchParams) => {
    return API.get(`/articles/?${params}`);
};

export const getLatestArticles = async (searchParams) => {
    const queryParams = new URLSearchParams();

    if (typeof searchParams.limit === "number") {
        queryParams.append("limit", searchParams.limit.toString());
    }

    return API.get(`/articles/latest?${queryParams}`);
};

export const getPopularArticles = async (searchParams) => {
    const queryParams = new URLSearchParams();

    if (searchParams.limit) {
        queryParams.append("limit", searchParams.limit);
    }

    return API.get(`/articles/popular?${queryParams}`);
};

export const getAllTrashedArticles = async (searchParams) => {
    const queryParams = new URLSearchParams();
    queryParams.append("page", searchParams.page);
    queryParams.append("title", searchParams.title);
    queryParams.append("author", searchParams.author);

    if (searchParams.limit !== null && searchParams.limit !== undefined) {
        queryParams.append("limit", searchParams.limit);
    }
    if (searchParams.verified !== null && searchParams.verified !== undefined) {
        queryParams.append("verified", searchParams.verified);
    }

    if (searchParams.tags && searchParams.tags.length > 0) {
        searchParams.tags.forEach((tag) => {
            queryParams.append("tags", tag);
        });
    }

    return API.get(`/articles/trashed/?${queryParams}`);
};

export const createArticle = async ({ formData }) => {
    return API.post("/articles", formData);
};

export const getArticle = async ({ id }) => {
    return API.get(`/articles/${id}`);
};

export const getArticleHistory = async ({ id }) => {
    return API.get(`/articles/${id}/history`);
};

export const verifyArticle = async ({ id, isVerified }) => {
    return API.post(`/articles/${id}/verify`, { isVerified });
};

export const markArticleAsFavourite = async ({ id }) => {
    return API.post(`/articles/${id}/markAsFavourite`);
};

export const updateArticle = async ({ id, formData }) => {
    console.log("ID");
    console.log(id);
    console.log("formData");
    console.log(formData);
    return API.put(`/articles/${id}`, formData);
};

export const deleteArticle = async ({ id }) => {
    return API.delete(`/articles/${id}`);
};

export const trashArticle = async ({ id }) => {
    return API.put(`/articles/${id}/trash`);
};

export const restoreArticle = async ({ id }) => {
    return API.put(`/articles/${id}/restore`);
};

export const getUsersArticleStats = async (searchParams) => {
    const queryParams = new URLSearchParams();
    if (searchParams.startDate) {
        queryParams.append("startDate", searchParams.startDate);
    }
    if (searchParams.endDate) {
        queryParams.append("endDate", searchParams.endDate);
    }

    return API.get(`/user/article-statistics?${queryParams}`);
};

export const getUsersChangedArticleStats = async (searchParams) => {
    const queryParams = new URLSearchParams();
    if (searchParams.startDate) {
        queryParams.append("startDate", searchParams.startDate);
    }
    if (searchParams.endDate) {
        queryParams.append("endDate", searchParams.endDate);
    }

    return API.get(`/user/change-statistics?${queryParams}`);
};

const getArticlesCreatedByUser = async ({ userId, searchParams }) => {
    const queryParams = new URLSearchParams();
    if (searchParams.startDate) {
        queryParams.append("startDate", searchParams.startDate);
    }
    if (searchParams.endDate) {
        queryParams.append("endDate", searchParams.endDate);
    }
    if (searchParams.limit) {
        queryParams.append("limit", searchParams.limit);
    }
    if (searchParams.page) {
        queryParams.append("page", searchParams.page);
    }
    return API.get(`/articles/userArticles/${userId}?${queryParams}`);
};

const getArticlesHistoryByUser = async ({ userId, searchParams }) => {
    const queryParams = new URLSearchParams();
    if (searchParams.startDate) {
        queryParams.append("startDate", searchParams.startDate);
    }
    if (searchParams.endDate) {
        queryParams.append("endDate", searchParams.endDate);
    }

    return API.get(`/articles/userHistory/${userId}?${queryParams}`);
};
const getArticleHistoryItem = async ({ id }: { id: string | null }) => {
    return API.get(`articles/history/${id}`);
};

export const articlesApi = {
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
