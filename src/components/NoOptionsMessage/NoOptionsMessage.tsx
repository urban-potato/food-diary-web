import { Link } from "react-router-dom";
import { NoticeProps, components } from "react-select";

// const NoOptionsMessage = (props: NoticeProps) => {
//   return (
//     <components.NoOptionsMessage {...props}>
//       <span className="">
//         Ничего не нашлось.{" "}
//         <Link
//           to="/food/simple"
//           className="underline text-near_black hover:text-light_near_black transition duration-1000 hover:duration-500"
//         >
//           Создать?
//         </Link>
//       </span>
//     </components.NoOptionsMessage>
//   );
// };

// type TProps = {
//   isLinkNeeded?: boolean;
//   linkAddress?: string;
// };

const NoOptionsMessage = (linkAddress: string = "") => {
  return (props: NoticeProps) => {
    return (
      <components.NoOptionsMessage {...props}>
        <span className="">
          Ничего не нашлось.{" "}
          {linkAddress && (
            <Link
              to={linkAddress}
              className="underline text-near_black hover:text-light_near_black transition duration-1000 hover:duration-500"
            >
              Создать?
            </Link>
          )}
        </span>
      </components.NoOptionsMessage>
    );
  };
};

export default NoOptionsMessage;
