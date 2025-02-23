import Validation from '../../../../../tools/validation.js';
import type { IGetPopularArticlesDto } from './types.js';

export default class GetPopularArticles implements IGetPopularArticlesDto {
  readonly limit: number;

  constructor(data: IGetPopularArticlesDto) {
    this.limit = data.limit;

    this.validate();
  }

  private validate(): void {
    new Validation(this.limit, 'limit').isDefined().isNumber();
  }
}
