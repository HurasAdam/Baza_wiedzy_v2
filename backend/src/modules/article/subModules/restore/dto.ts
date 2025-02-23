import Validation from '../../../../tools/validation.js';
import type { IRestoreArticleDto } from './types.js';

export default class RestoreArticleDto implements IRestoreArticleDto {
  readonly id: string;
  readonly userId: string;

  constructor(data: IRestoreArticleDto) {
    this.id = data.id;
    this.userId = data.userId;

    this.validate();
  }

  private validate(): void {
    new Validation(this.id, 'id').isDefined().isString();
    new Validation(this.userId, 'userId').isDefined().isString();
  }
}
