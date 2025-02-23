export interface IUpdateArticleDto {
  id: string;
  userId: string;
  title: string;
  clientDescription: string;
  employeeDescription: string;
  tags: string[];
  product: string;
}
