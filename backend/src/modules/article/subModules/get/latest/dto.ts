import Validation from '../../../../../tools/validation.js';
import type { IGetLatestArticleDto } from './types.js';

export default class GetLatestArticlesDto implements IGetLatestArticleDto {
  readonly limit: string;

  constructor(data: IGetLatestArticleDto) {
    this.limit = data.limit;

    this.validate();
  }

  private validate(): void {
    new Validation(this.limit, 'limit').isDefined().isString();
  }
}
