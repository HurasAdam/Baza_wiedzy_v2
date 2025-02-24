import Validation from '../../../../../tools/validation.js';
import type { IGetUserDto } from './types.js';

export default class GetUserDto implements IGetUserDto {
  readonly userId: string;

  constructor(data: IGetUserDto) {
    this.userId = data.userId;

    this.validate();
  }

  private validate(): void {
    new Validation(this.userId, 'userId').isDefined().isString();
  }
}
