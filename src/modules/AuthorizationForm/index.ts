import { useGetMeQuery, useLazyGetMeQuery } from "./api/authorization.api";
import { useIsAuth } from "../../global/hooks/use-is-auth.hook";
import AuthorizationForm from "./components/AuthorizationForm";

export { AuthorizationForm, useLazyGetMeQuery, useIsAuth, useGetMeQuery };
