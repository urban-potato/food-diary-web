import { FC } from "react";
import { Link } from "react-router-dom";
import { BiSolidFoodMenu } from "react-icons/bi";
import { cva } from "class-variance-authority";
import { useIsAuth } from "../../global/hooks/use-is-auth.hook";

const navItemVariants = cva(
  "nav_item font-bold hover:text-light_near_black transition duration-1000 hover:duration-200 outline-none",
  {
    variants: {
      navItemVariant: {
        base: "max-w-[120px] min-w-[120px]",
        logo: "max-w-[150px] min-w-0 mr-5",
      },
    },
    defaultVariants: {
      navItemVariant: "base",
    },
  }
);

const Header: FC = () => {
  const isAuth = useIsAuth();

  return (
    // desktop nav
    <nav className="nav_container">
      <Link to="/" className={navItemVariants({ navItemVariant: "logo" })}>
        Food <BiSolidFoodMenu className="w-[50px] h-[50px] text-pink-500" />
        Diary
      </Link>

      {isAuth ? (
        <>
          <Link to="/diary" className={navItemVariants()}>
            Дневник
          </Link>
          <Link to="/food/simple" className={navItemVariants()}>
            Блюда
          </Link>
          <Link
            to="/profile"
            className="outline-none nav_item max-w-[150px] min-w-[120px] ml-auto btn_dark"
          >
            Профиль
          </Link>
        </>
      ) : (
        <article className="flex flex-wrap nav_gap flex-grow flex-shrink justify-center items-center ml-auto max-w-max">
          <Link to="/login" className={navItemVariants()}>
            Вход
          </Link>

          <div className="relative group max-w-max">
            <div
              className="absolute -inset-0.5 
            bg-gradient-to-r from-indigo-700 to-purple-700 
            rounded-full 
            blur 
            opacity-80 
            group-hover:opacity-100 
            transition duration-1000 
            group-hover:duration-500 
            animate-tilt"
            ></div>
            <Link
              to="/register"
              className="outline-none relative nav_item max-w-max text-near_white border-near_black bg-near_black "
            >
              Регистрация
            </Link>
          </div>
        </article>
      )}
    </nav>
  );
};

export default Header;
