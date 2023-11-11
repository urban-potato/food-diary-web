import { FC } from "react";
import { useNavigate } from "react-router-dom";

const ErrorPage: FC = () => {
  const navigate = useNavigate();

  return (
    <div className="">
      <h2 className="">
        <p>Ой! Здесь пусто... </p>
        <h3 className="">404 ошибка</h3>
        <p>Вернитесь на главную страницу</p>
      </h2>

      <button className="" onClick={(): void => navigate(-1)}>
        Назад
      </button>
    </div>
  );
};

export default ErrorPage;
