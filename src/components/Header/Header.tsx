import { FC } from "react";
import { Link } from "react-router-dom";
import { useIsAuth } from "../../modules/AuthorizationModule/index";
import classNames from "classnames";

const Header: FC = () => {
  const isAuth = useIsAuth();

  return (
    <nav className="">
      {!isAuth ? (
        ""
      ) : (
        <>
          <Link to="/diary" className="">
            Дневник
          </Link>
          <Link to="/food" className="">
            Блюда
          </Link>
        </>
      )}

      <Link to="/" className="">
        Logo
      </Link>
      {!isAuth ? (
        <>
          <Link to="/login" className="">
            Вход
          </Link>
          <Link to="/register" className="">
            Регистрация
          </Link>
        </>
      ) : (
        <Link to="/profile" className="">
          Профиль
        </Link>
      )}
    </nav>
  );
};

export default Header;
