import { Navigate } from "react-router-dom";
import { useIsAuth } from "../../modules/AuthorizationRegistrationModule";

type ProtectedPagePropsType = {
  children: JSX.Element;
};

const ProtectedPage = ({ children }: ProtectedPagePropsType) => {
    const isAuth = useIsAuth();
    return <>{isAuth ? children : <Navigate to="/login" replace={true} />}</>;
};

export default ProtectedPage;
