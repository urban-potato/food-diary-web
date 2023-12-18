import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../../global/store/store.ts";
import { IUser } from "../../AuthorizationRegistrationModule/types/types.ts";

interface IUserState {
  user: IUser | null;
  isAuth: boolean;
}

const initialState: IUserState = {
  user: null,
  isAuth: false,
};

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    login: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
      state.isAuth = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuth = false;
    },
  },
});

export const { login, logout } = userSlice.actions;

export const selectCount = (state: RootState) => state.user;

export default userSlice.reducer;
