export interface IGetManyArticlesDto {
  userId: string;
  limit?: string;
  page?: string;
  sortBy?: string;
  product?: string;
  title?: string;
}
