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
