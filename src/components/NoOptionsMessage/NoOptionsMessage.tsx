import { NoticeProps, components } from "react-select";

const NoOptionsMessage = (props: NoticeProps) => {
  return (
    <components.NoOptionsMessage {...props}>
      <span className="">Ничего не нашлось</span>
    </components.NoOptionsMessage>
  );
};

export default NoOptionsMessage;
