import { Navigate } from "react-router-dom";
import { useIsAuth } from "../../../modules/AuthorizationForm";
import { FC } from "react";

type TProps = {
  children: JSX.Element;
};

const ProtectedPage: FC<TProps> = ({ children }) => {
  const isAuth = useIsAuth();
  if (!isAuth) return <Navigate to="/login" replace={true} />;

  return children;

  // return <>{isAuth ? children : <Navigate to="/login" replace={true} />}</>;
};

export default ProtectedPage;
