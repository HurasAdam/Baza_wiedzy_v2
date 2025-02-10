import { ITagEntity } from "modules/tag/model.ts";

export interface ICreateArticleRequest {
  name: string;
}

export interface ICreateTagParams {
  request: ICreateArticleRequest;
  userId: string; // Zakładam, że userId to string
}


export interface IUpdateTagParams {
  request:ICreateArticleRequest
  tagId:string;

}

export interface GetTagsResponse {
  tags: ITagEntity[];
  totalCount: number;
}

interface GetTagsQuery {
  search?: string;
}
