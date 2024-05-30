import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../../global/store/store.ts";
import { IUser } from "../../../global/types/entities-types.ts";

type IUserState = {
  userInfo: IUser | null;
  isAuth: boolean;
};

const initialState: IUserState = {
  userInfo: null,
  isAuth: false,
};

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    login: (state, action: PayloadAction<IUser>) => {
      state.userInfo = action.payload;
      state.isAuth = true;
    },
    logout: (state) => {
      state.userInfo = null;
      state.isAuth = false;
    },
  },
});

export const { login, logout } = userSlice.actions;

export const selectCount = (state: RootState) => state.user;

export default userSlice.reducer;
