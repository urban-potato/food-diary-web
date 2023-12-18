import React from "react";

const Footer = () => {
  return (
    <footer className="p-2 text-center ">
      <p>
        Created by{" "}
        <a
          href="https://github.com/urban-potato"
          className="underline hover:text-light_near_black transition duration-1000 hover:duration-200"
        >
          urban-potato
        </a>
      </p>
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
