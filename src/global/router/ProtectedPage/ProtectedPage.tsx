import { Navigate, Outlet } from "react-router-dom";
import { FC } from "react";
import { useIsAuth } from "../../hooks/use-is-auth.hook";

const ProtectedPage: FC = () => {
  const isAuth = useIsAuth();

  if (!isAuth) return <Navigate to="/login" replace={true} />;

  return <Outlet />;
};

export default ProtectedPage;
