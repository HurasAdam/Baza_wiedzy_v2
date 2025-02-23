import Validation from '../../../../tools/validation.js';
import type { IVerifyArticleDto } from './types.js';

export default class VerifyArticleDto implements IVerifyArticleDto {
  readonly id: string;
  readonly userId: string;
  readonly isVerified: boolean;

  constructor(data: IVerifyArticleDto) {
    this.id = data.id;
    this.userId = data.userId;
    this.isVerified = data.isVerified;

    this.validate();
  }

  private validate(): void {
    new Validation(this.id, 'id').isDefined().isString();
    new Validation(this.userId, 'userId').isDefined().isString();
    new Validation(this.isVerified, 'isVerified').isDefined().isBoolean();
  }
}
