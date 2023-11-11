// import Header from "./Header";
import { FC } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";

const Layout: FC = () => {
  return (
    <>
      <section className="header">
        <Header />
      </section>

      <Outlet />
    </>
  );
};

export default Layout;
