import Validation from '../../../../tools/validation.js';
import type { IRegisterDto } from './types.js';

export default class RegisterDto implements IRegisterDto {
  readonly userAgent?: string;
  readonly name: string;
  readonly surname: string;
  readonly email: string;
  readonly password: string;

  constructor(data: IRegisterDto, userAgent: string | undefined) {
    this.userAgent = userAgent;
    this.name = data.name;
    this.surname = data.surname;
    this.email = data.email;
    this.password = data.password;

    this.validate();
  }

  private validate(): void {
    new Validation(this.email, 'email').isDefined().isString().hasLength(255, 1);
    new Validation(this.password, 'password').isDefined().isString().hasLength(255, 6);
    new Validation(this.surname, 'surname').isDefined().isString().hasLength(255, 3);
    new Validation(this.name, 'name').isDefined().isString().hasLength(255, 3);

    if (this.userAgent) new Validation(this.userAgent, 'userAgent').isDefined().isString();
  }
}
