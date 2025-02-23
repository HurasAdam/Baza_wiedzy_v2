import Validation from '../../../../tools/validation.js';
import type { ITrashArticleDto } from './types.js';

export default class TrashArticleDto implements ITrashArticleDto {
  readonly id: string;
  readonly userId: string;

  constructor(data: ITrashArticleDto) {
    this.id = data.id;
    this.userId = data.userId;

    this.validate();
  }

  private validate(): void {
    new Validation(this.id, 'id').isDefined().isString();
    new Validation(this.userId, 'userId').isDefined().isString();
  }
}
