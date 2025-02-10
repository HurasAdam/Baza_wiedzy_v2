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