import Validation from '../../../../../tools/validation.js';
import type { IGetFavArticlesDto } from './types.js';

export default class GetFavArticlesDto implements IGetFavArticlesDto {
  readonly userId: string;
  readonly page?: string;

  constructor(data: IGetFavArticlesDto) {
    this.userId = data.userId;
    this.page = data.page;

    this.validate();
  }

  private validate(): void {
    new Validation(this.userId, 'userId').isDefined().isString();
    if (this.page) new Validation(this.page, 'page').isDefined().isString();
  }
}
