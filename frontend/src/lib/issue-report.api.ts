import api from "@/config/api.client";

const baseUrl = "/issue-report";

const sendIssueReport = async (formData) => {
    console.log(formData, "PRZED WYSYŁKA");
    return api.post(baseUrl, formData);
};

export const issueReportApi = {
    sendIssueReport,
};
