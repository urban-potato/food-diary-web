import { FC } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

const Layout: FC = () => {
  return (
    <section className="min-h-screen h-full  flex flex-col text-near_black bg-near_white text-base">
      <section className="h-max">
        <Header />
      </section>

      <section className="h-full flex-grow flex flex-col justify-center items-center py-5 px-5">
        <Outlet />
      </section>

      <section className="h-max">
        <Footer />
      </section>
    </section>
  );
};

export default Layout;
