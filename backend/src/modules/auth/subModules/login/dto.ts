import Validation from '../../../../tools/validation.js';
import type { ILoginDto } from './types.js';

export default class LoginDto implements ILoginDto {
  readonly userAgent?: string;
  readonly password: string;
  readonly email: string;

  constructor(data: ILoginDto, userAgent?: string) {
    this.userAgent = userAgent;
    this.email = data.email;
    this.password = data.password;

    this.validate();
  }

  private validate(): void {
    new Validation(this.email, 'email').isDefined().isString().hasLength(255, 3);
    new Validation(this.password, 'password').isDefined().isString().hasLength(255, 6);
    if (this.userAgent) new Validation(this.userAgent, 'userAgent').isDefined().isString().hasMinLength(1);
  }
}
