import api from "@/config/api.client";

const baseUrl = "/issue-report";

const sendIssueReport = async (formData) => {
    return api.post(baseUrl, formData);
};

const find = async (params: URLSearchParams) => {
    return api.get(baseUrl, { params });
};
const findOne = async (id) => {
    return api.get(`${baseUrl}/${id}`);
};

const findMyIssueReports = async (params: URLSearchParams) => {
    console.log(params);
    return api.get(`${baseUrl}/mine`, { params });
};

export const issueReportApi = {
    sendIssueReport,
    find,
    findOne,
    findMyIssueReports,
};
