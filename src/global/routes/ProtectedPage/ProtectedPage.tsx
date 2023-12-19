import { Navigate } from "react-router-dom";
import { useIsAuth } from "../../../modules/AuthorizationRegistrationForms";
import { FC } from "react";
import { ProtectedPageProps } from "./types/types";

const ProtectedPage: FC<ProtectedPageProps> = ({ children }) => {
  const isAuth = useIsAuth();
  return <>{isAuth ? children : <Navigate to="/login" replace={true} />}</>;
};

export default ProtectedPage;
