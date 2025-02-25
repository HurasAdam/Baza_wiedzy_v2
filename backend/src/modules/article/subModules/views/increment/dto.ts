import Validation from '../../../../../tools/validation.js';
import type { IIncrementViewsDto } from './types.js';

export default class IncrementViewsDto implements IIncrementViewsDto {
  readonly articleId: string;

  constructor(data: IIncrementViewsDto) {
    this.articleId = data.articleId;

    this.validate();
  }

  private validate(): void {
    new Validation(this.articleId, 'articleId').isDefined().isString();
  }
}
