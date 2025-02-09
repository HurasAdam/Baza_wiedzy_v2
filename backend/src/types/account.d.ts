export interface ICreateAccountParams {
  name: string;
  surname: string;
  email: string;
  password: string;
  userAgent?: string;
}

export interface IResetPasswordParams {
  password: string;
  verificationCode: string;
}
