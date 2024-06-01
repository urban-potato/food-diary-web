import { FC } from "react";

type TProps = {
  messageText: string;
};

const ToastMessage: FC<TProps> = ({ messageText }) => {
  return <div className="text-center">{messageText}</div>;
};

export default ToastMessage;
