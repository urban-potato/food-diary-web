// import Header from "./Header";
import { FC } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";

const Layout: FC = () => {
  return (
    <section className=" min-h-screen h-full  flex flex-col 
    text-near_black bg-near_white 
    
    ">
      <section className="h-max 
    
      ">
        <Header />
      </section>

      {/* <section className="border flex justify-center items-center h-screen"> pb-9 pt-9 pl-5 pr-5  */}
      <section className=" h-full flex-grow
      flex flex-col justify-center items-center 
      py-5 px-5 
  
      ">
        {/* <section className="border flex justify-center items-center "> */}

        <Outlet />
      </section>

      <footer className=" h-max p-2 text-center 
   
      ">
        <p>
          Created by <a href="https://github.com/urban-potato" className="underline hover:text-light_near_black transition duration-1000 hover:duration-200">urban-potato</a>
        </p>
        <a className="underline hover:text-light_near_black transition duration-1000 hover:duration-200" href="https://lordicon.com/">Icons by Lordicon.com</a>
      </footer>
    </section>
  );
};

export default Layout;