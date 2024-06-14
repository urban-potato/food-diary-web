import { NoticeProps, components } from "react-select";
import { HashLink } from "react-router-hash-link";

const NoOptionsMessage = (linkAddress: string = "") => {
  return (props: NoticeProps) => {
    return (
      <components.NoOptionsMessage {...props}>
        <span className="">
          Ничего не нашлось.{" "}
          {linkAddress && (
            <HashLink
              to={linkAddress}
              className="underline text-near_black hover:text-light_near_black transition duration-1000 hover:duration-500"
            >
              Создать?
            </HashLink>
          )}
        </span>
      </components.NoOptionsMessage>
    );
  };
};

export default NoOptionsMessage;
