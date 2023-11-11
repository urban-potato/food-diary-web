import { FC } from "react";
import { Navigate } from "react-router-dom";
import { useIsAuth } from "../modules/AuthorizationModule/index";

type Props = {
  children: JSX.Element;
};

const ProtectedPage: FC<Props> = ({ children }) => {
  const isAuth = useIsAuth();
  return <>{isAuth ? children : <Navigate to="/login" replace={true} />}</>;
};

export default ProtectedPage;
