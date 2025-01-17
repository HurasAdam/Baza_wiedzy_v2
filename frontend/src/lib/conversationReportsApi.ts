import API from "@/config/api.client";

const sendConversationReport = async ({ description, topic }) => {
  return API.post("/conversation-report/add", { description, topic });
};

const getCoversationReportStats = async (searchParams) => {
  const queryParams = new URLSearchParams();
  if (searchParams.startDate) {
    queryParams.append("startDate", searchParams.startDate);
  }
  if (searchParams.endDate) {
    queryParams.append("endDate", searchParams.endDate);
  }

  return API.get(`/user/statistics?${queryParams}`);
};

const getConversationReportValues = async (searchParams) => {
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
  return API.get(`/conversation-report?${queryParams}`);
};

export const conversationReportApi = {
  sendConversationReport,
  getCoversationReportStats,
  getConversationReportValues,
};
