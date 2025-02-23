import Validation from '../../../../tools/validation.js';
import { newTagSchema } from '../../schema.js';
import type { ICreateTagDto } from './types.js';

export default class CreateTagDto implements ICreateTagDto {
  readonly name: string;
  readonly userId: string;

  constructor(data: ICreateTagDto, userId: string) {
    this.name = data.name;
    this.userId = userId;

    this.validate(data);
  }

  private validate(data: ICreateTagDto): void {
    newTagSchema.parse(data);
    new Validation(this.userId, 'userId').isDefined().isString();
  }
}
