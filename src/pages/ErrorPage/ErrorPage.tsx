import { FC } from "react";
import { Link } from "react-router-dom";

const ErrorPage: FC = () => {
  return (
    <section className="h-full flex-grow flex flex-col justify-center items-center py-5 px-5 gap-y-1 overflow-hidden">
      <div className="flex justify-center items-center w-full overflow-hidden">
        <h2 className="text-ellipsis">Ой! Здесь пусто...</h2>
      </div>

      <div className="flex justify-center items-center w-full overflow-hidden">
        <h3 className="text-2xl text-ellipsis">404 ошибка</h3>
      </div>

      <div className="flex justify-center items-center w-full overflow-hidden">
        <Link
          to="/"
          className="text-ellipsis underline hover:text-light_near_black transition duration-1000 hover:duration-500"
        >
          Вернуться на главную страницу
        </Link>
      </div>
    </section>
  );
};

export default ErrorPage;
