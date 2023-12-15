export interface IUser {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
}

export interface IUserAuthData {
  email: string;
  password: string;
}

export interface loginResponseType {
  token: string;
  expiresIn: number;
}

export interface AuthorizationFormType {
  email: string;
  password: string;
}
