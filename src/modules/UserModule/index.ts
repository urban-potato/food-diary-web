import { useLazyGetUserInfoQuery } from "./api/user.api";
import ProfileModule from "./components/ProfileModule";

import { login, logout } from "./slices/userSlice";

export { useLazyGetUserInfoQuery, login, logout, ProfileModule };
