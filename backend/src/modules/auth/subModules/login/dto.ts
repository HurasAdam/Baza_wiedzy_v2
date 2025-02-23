import { loginSchema } from '../../schemas.js';
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
    loginSchema.parse({
      userAgent: this.userAgent,
      password: this.password,
      email: this.email,
    });
  }
}
