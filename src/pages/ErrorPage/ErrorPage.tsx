import { FC } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ErrorPage.module.css";

const ErrorPage: FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <h2 className={styles.header}>
        <p>Ой! Здесь пусто... </p>
        <h3 className={styles.error}>404 ошибка</h3>
        <p>Вернитесь на главную страницу</p>
      </h2>

      <button className={styles.btn} onClick={(): void => navigate(-1)}>
        Назад
      </button>
    </div>
  );
};

export default ErrorPage;
