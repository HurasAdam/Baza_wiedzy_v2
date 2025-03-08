import Validation from '../../../../tools/validation.js';
import type { ICreateTagDto } from './types.js';

export default class CreateTagDto implements ICreateTagDto {
  readonly name: string;
  readonly userId: string;

  constructor(data: ICreateTagDto, userId: string) {
    this.name = data.name;
    this.userId = userId;

    this.validate();
  }

  private validate(): void {
    new Validation(this.name, 'name').isDefined().isString().hasLength(20, 2);
    new Validation(this.userId, 'userId').isDefined().isString();
  }
}
