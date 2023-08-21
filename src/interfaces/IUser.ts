import { UserDTO } from '../dto/UserDTO';

export interface IUserDocument extends UserDTO {}

export interface IUserLogin {
  email: UserDTO['email'];
  password: string;
}

export interface IUserLoginResponse {
  _id: string;
  token: string;
  refreshToken: string;
}

export interface IUserSignupResponse {
  _id: string;
  message?: string;
}

export interface IVerifyEmailInput {
  token: string;
}

export interface IForgotPasswordInput {
  email: string;
}

export interface IResetPasswordInput {
  token: string;
  password: string;
}

export interface IResendVerificationEmail {
  email: string;
}

export interface ITokenPayload {
  _id: string;
}

export interface IChangePassword {
  oldPassword: string;
  password: string;
}
