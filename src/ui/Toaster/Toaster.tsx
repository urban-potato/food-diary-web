import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, Slide } from "react-toastify";

const Toaster = ({ ...rest }) => {
  return (
    <ToastContainer
      autoClose={3000}
      transition={Slide}
      hideProgressBar
      {...rest}
    />
  );
};

export default Toaster;
