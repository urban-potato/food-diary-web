export interface IUser {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
}

export interface LoginResponse {
  token: string;
  expiresIn: number;
}

export interface AuthorizationData {
  email: string;
  password: string;
}
