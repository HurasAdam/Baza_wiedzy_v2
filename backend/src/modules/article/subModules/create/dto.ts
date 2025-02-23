import { newArticleSchema } from '../../../../modules/article/schema.js';
import type { ICreateArticleDto } from './types.js';

export default class CreateArticlesDto implements ICreateArticleDto {
  readonly title: string;
  readonly employeeDescription: string;
  readonly tags: string[];
  readonly clientDescription: string;
  readonly product: string;
  readonly userId: string;

  constructor(data: ICreateArticleDto) {
    this.title = data.title;
    this.employeeDescription = data.employeeDescription;
    this.tags = data.tags;
    this.clientDescription = data.clientDescription;
    this.product = data.product;
    this.userId = data.userId;

    this.validate(data);
  }

  private validate(data: ICreateArticleDto): void {
    newArticleSchema.parse(data);
  }
}
