export interface ICreateConversationTopicRequest {
  title: string;
  product: string;
}

export interface ICreateConversationTopicParams {
  request: ICreateConversationTopicRequest;
  userId: string;
}

export interface IGetConversationTopicParams {
  topicId: string;
  userId: string;
}

interface ICreateConversationRaportTopicRequest {
  description?: string;
  topic: string;
}

interface ICreateConversationRaportTopicParams {
  request: ICreateConversationRaportTopicRequest;
  userId: string;
}
