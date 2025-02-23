import Validation from '../../../../tools/validation.js';
import type { IUpdateArticleDto } from './types.js';

export default class UpdateArticleDto implements IUpdateArticleDto {
  readonly id: string;
  readonly userId: string;
  readonly title: string;
  readonly clientDescription: string;
  readonly employeeDescription: string;
  readonly tags: string[];
  readonly product: string;

  constructor(data: IUpdateArticleDto, id: string, userId: string) {
    this.id = id;
    this.userId = userId;
    this.title = data.title;
    this.clientDescription = data.clientDescription;
    this.employeeDescription = data.employeeDescription;
    this.tags = data.tags;
    this.product = data.product;

    this.validate();
  }

  private validate(): void {
    new Validation(this.id, 'id').isDefined().isString();
    new Validation(this.userId, 'userId').isDefined().isString();
    new Validation(this.title, 'title').isDefined().isString();
    new Validation(this.clientDescription, 'clientDescription').isDefined().isString();
    new Validation(this.employeeDescription, 'employeeDescription').isDefined().isString();
    new Validation(this.tags, 'tags').isDefined().isArray().isStringArray();
    new Validation(this.product, 'product').isDefined().isString();
  }
}
