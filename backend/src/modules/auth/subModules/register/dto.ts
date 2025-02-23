import { registerSchema } from '../../schemas.js';
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
    registerSchema.parse({
      userAgent: this.userAgent,
      name: this.name,
      surname: this.surname,
      email: this.email,
      password: this.password,
    });
  }
}
