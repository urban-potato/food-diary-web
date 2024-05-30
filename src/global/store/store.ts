import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { api } from "../api/api";
import { userReducer } from "../../modules/UserInfoTile";

const reducers = combineReducers({
  user: userReducer,
  [api.reducerPath]: api.reducer,
});

const store = configureStore({
  reducer: reducers,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
  // getDefaultMiddleware().concat(api.middleware).concat().concat(logger),
});

export default store;

// TODO: ИЗУЧИТЬ

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
