import { FC } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header/Header";

const ErrorPage: FC = () => {
  return (
    <section className="min-h-screen h-full  flex flex-col text-near_black bg-near_white">
      <section className="h-max">
        <Header />
      </section>
      <section className="h-full flex-grow flex flex-col justify-center items-center py-5 px-5 gap-y-1">
        <div className="flex justify-center items-center w-full">
          <h2 className="text-ellipsis overflow-hidden">Ой! Здесь пусто...</h2>
        </div>

        <div className="flex justify-center items-center w-full">
          <h3 className="text-2xl text-ellipsis overflow-hidden">404 ошибка</h3>
        </div>

        <div className="flex justify-center items-center w-full">
          <Link
            to="/"
            className="text-ellipsis overflow-hidden underline hover:text-light_near_black transition duration-1000 hover:duration-500"
          >
            Вернитесь на главную страницу
          </Link>
        </div>
      </section>
    </section>
  );
};

export default ErrorPage;
