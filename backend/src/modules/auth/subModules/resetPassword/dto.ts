import { resetPasswordSchema } from '../../schemas.js';
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
    resetPasswordSchema.parse({
      verificationCode: this.verificationCode,
      password: this.password,
    });
  }
}
