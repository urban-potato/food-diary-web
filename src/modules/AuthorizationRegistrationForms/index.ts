import { useGetMeQuery, useLazyGetMeQuery } from "./api/auth.api";
import { useIsAuth } from "./hooks/hooks";
import RegistrationForm from "./components/RegistrationForm";
import AuthorizationForm from "./components/AuthorizationForm";

export {
  AuthorizationForm,
  RegistrationForm,
  useLazyGetMeQuery,
  useIsAuth,
  useGetMeQuery,
};
