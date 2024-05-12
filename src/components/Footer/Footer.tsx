import { FC } from "react";

const Footer: FC = () => {
  return (
    <footer className="p-2 text-center ">
      <a
        className="underline hover:text-light_near_black transition duration-1000 hover:duration-200"
        href="https://lordicon.com/"
      >
        Icons by Lordicon.com
      </a>
    </footer>
  );
};

export default Footer;
