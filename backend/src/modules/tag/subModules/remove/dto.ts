import Validation from '../../../../tools/validation.js';
import type { IRemoveTagDto } from './types.js';

export default class RemoveTagDto implements IRemoveTagDto {
  readonly id: string;

  constructor(data: IRemoveTagDto) {
    this.id = data.id;

    this.validate();
  }

  private validate(): void {
    new Validation(this.id, 'id').isDefined().isString();
  }
}
