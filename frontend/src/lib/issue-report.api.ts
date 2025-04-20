import api from "@/config/api.client";

const baseUrl = "/issue-report";

const sendIssueReport = async (formData) => {
    return api.post(baseUrl, formData);
};

const find = async () => {
    return api.get(baseUrl);
};
const findOne = async (id) => {
    return api.get(`${baseUrl}/${id}`);
};

export const issueReportApi = {
    sendIssueReport,
    find,
    findOne,
};
