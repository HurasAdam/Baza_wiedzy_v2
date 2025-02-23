import Validation from '../../../../tools/validation.js';
import type { IRemoveArticleDto } from './types.js';

export default class RemoveArticleDto implements IRemoveArticleDto {
  readonly id: string;

  constructor(data: IRemoveArticleDto) {
    this.id = data.id;

    this.validate();
  }

  private validate(): void {
    new Validation(this.id, 'id').isDefined().isString();
  }
}
