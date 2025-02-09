export interface ICreateArticleRequest {
  title: string;
  employeeDescription: string;
  tags: string[];
  clientDescription: string;
  product: string;
}

export interface ICreateArticleParams {
  request: ICreateArticleRequest;
  userId: string;
}
