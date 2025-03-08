import Validation from '../../../../tools/validation.js';
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

    this.validate();
  }

  private validate(): void {
    new Validation(this.title, 'title').isDefined().isString().hasLength(90, 4);
    new Validation(this.employeeDescription, 'employeeDescription').isDefined().isString().hasLength(9000, 6);
    new Validation(this.clientDescription, 'clientDescription').isDefined().isString().hasLength(9000, 6);
    new Validation(this.tags, 'tags').isDefined().isStringArray().minElements(1).isObjectIdArray();
    new Validation(this.product, 'product').isDefined().isString().isObjectId();
    new Validation(this.userId, 'userId').isDefined().isString().isObjectId();
  }
}
