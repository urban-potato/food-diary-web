import { FC } from "react";
import { Link } from "react-router-dom";
import { useIsAuth } from "../../modules/AuthorizationModule/index";
import classNames from "classnames";
import { BiSolidFoodMenu } from "react-icons/bi";

const Header: FC = () => {
  const isAuth = useIsAuth();

  return (
    // desktop nav
    <nav className="nav_container ">
      <Link
        to="/"
        className="nav_item max-w-[150px] min-w-[150px] font-bold 
        hover:text-light_near_black transition duration-1000 hover:duration-200 mr-5 "
      >
        {/* <Link
        to="/"
        className="nav_item max-w-[150px] min-w-[150px] font-bold 
        hover:bg-gradient-to-r hover:from-pink-700 hover:to-violet-700 
        transition duration-1000 hover:duration-200 mr-5
        bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500"
      > */}
        Food <BiSolidFoodMenu className=" w-[50px] h-[50px] text-pink-500" />{" "}
        Diary
      </Link>

      {!isAuth ? (
        ""
      ) : (
        <>
          <Link
            to="/diary"
            className="nav_item max-w-[120px] min-w-[120px] font-bold 
            hover:text-light_near_black transition duration-1000 hover:duration-200 "
          >
            Дневник
          </Link>
          <Link
            to="/food"
            className="nav_item max-w-[120px] min-w-[120px] font-bold 
            hover:text-light_near_black transition duration-1000 hover:duration-200 "
          >
            Блюда
          </Link>
        </>
      )}

      {!isAuth ? (
        <article
          className="flex flex-wrap nav_gap flex-grow flex-shrink 
   
        justify-center 
        items-center 

        ml-auto

        
        min-w-[120px]
        max-w-[270px]

        "
        >
          <Link
            to="/login"
            className="nav_item max-w-[120px] min-w-[120px] font-bold 
            hover:text-light_near_black transition duration-1000 hover:duration-200"
          >
            Вход
          </Link>

          <div
            className="relative group 
          max-w-[250px] min-w-[120px]"
          >
            <div
              className="absolute -inset-0.5 
            bg-gradient-to-r from-indigo-700 to-purple-700 
            rounded-full blur opacity-80 
            group-hover:opacity-100 transition duration-1000 
            group-hover:duration-200 
            animate-tilt"
            ></div>
            <Link
              to="/register"
              className=" relative
              truncate 
              nav_item 
              max-w-[150px] min-w-[120px] btn_register "
            >
              Регистрация
            </Link>
          </div>
        </article>
      ) : (
        <Link
          to="/profile"
          className="nav_item max-w-[150px] min-w-[120px] ml-auto btn_dark"
        >
          Профиль
        </Link>
      )}
    </nav>
  );
};

export default Header;
