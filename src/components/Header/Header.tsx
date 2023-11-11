import { FC } from "react";
import { Link } from "react-router-dom";
import { useIsAuth } from "../../modules/AuthorizationModule/index";
import styles from "./Header.module.css";
import classNames from "classnames";

const Header: FC = () => {
  const isAuth = useIsAuth();

  return (
    <nav className={styles.container}>
      {!isAuth ? (
        ""
      ) : (
        <>
          <Link to="/diary" className={styles.item}>
            Дневник
          </Link>
          <Link to="/food" className={styles.item}>
            Блюда
          </Link>
        </>
      )}

      <Link to="/" className={classNames(styles.item, styles.logo)}>
        Logo
      </Link>
      {!isAuth ? (
        <>
          <Link to="/login" className={classNames(styles.item, styles.login)}>
            Вход
          </Link>
          <Link
            to="/register"
            className={classNames(styles.item, styles.register)}
          >
            Регистрация
          </Link>
        </>
      ) : (
        <Link to="/profile" className={styles.item}>
          Профиль
        </Link>
      )}
    </nav>
  );
};

export default Header;
