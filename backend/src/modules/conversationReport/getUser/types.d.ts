export interface IGetUserConversationReportsQuery {
  startDate?: string;
  endDate?: string;
  page?: string;
  limit?: string;
}

export interface IGetUserConversationReportsDto extends IGetUserConversationReportsQuery {
  userId: string;
}
