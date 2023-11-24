// import Header from "./Header";
import { FC } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";

const Layout: FC = () => {
  return (
    <section className="h-screen flex flex-col text-near_black bg-near_white ">
      <section className="h-max ">
        <Header />
      </section>

      {/* <section className="border flex justify-center items-center h-screen"> pb-9 pt-9 pl-5 pr-5  */}
      <section className="flex justify-center items-center  h-full py-5 px-5 ">
        {/* <section className="border flex justify-center items-center "> */}

        <Outlet />
      </section>
    </section>
  );
};

export default Layout;
