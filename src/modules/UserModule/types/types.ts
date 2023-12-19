export interface UserProfileEditFormProps {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  setIsEditMode: Function;
}

export interface UserData {
  email: string;
  firstName: string;
  lastName: string;
}

export interface IUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
}

export interface IUserState {
  userInfo: IUser | null;
  isAuth: boolean;
}
