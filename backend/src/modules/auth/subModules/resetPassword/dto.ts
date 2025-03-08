import Validation from '../../../../tools/validation.js';
import type { IResetPasswordDto } from './types.js';

export default class ResetPasswordDto implements IResetPasswordDto {
  readonly password: string;
  readonly verificationCode: string;

  constructor(data: IResetPasswordDto) {
    this.password = data.password;
    this.verificationCode = data.verificationCode;

    this.validate();
  }

  private validate(): void {
    new Validation(this.password, 'password').isDefined().isString().hasLength(255, 6);
    new Validation(this.verificationCode, 'verificationCode').isDefined().isString().hasLength(24, 1);
  }
}
