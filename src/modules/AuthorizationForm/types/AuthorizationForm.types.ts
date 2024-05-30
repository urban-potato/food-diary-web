export interface LoginResponse {
  token: string;
  expiresIn: number;
}

export interface AuthorizationData {
  email: string;
  password: string;
}
