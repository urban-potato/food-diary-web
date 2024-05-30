import { Navigate } from "react-router-dom";
import { useIsAuth } from "../../../modules/AuthorizationForm";
import { FC } from "react";

type ProtectedPageProps = {
  children: JSX.Element;
};

const ProtectedPage: FC<ProtectedPageProps> = ({ children }) => {
  const isAuth = useIsAuth();
  return <>{isAuth ? children : <Navigate to="/login" replace={true} />}</>;
};

export default ProtectedPage;
