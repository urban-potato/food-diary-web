import { toast } from "react-toastify";
import ToastMessage from "../../ui/ToastMessage/ToastMessage";

type TProps = {
  messageText: string;
  position?:
    | "top-right"
    | "top-center"
    | "top-left"
    | "bottom-right"
    | "bottom-center"
    | "bottom-left";
  theme?: "light" | "dark" | "colored";
  toastId: string | number;
  toastType: "info" | "success" | "warning" | "error" | "default";
};

export function notify({
  messageText,
  position = "top-center",
  theme = "colored",
  toastId,
  toastType,
  ...rest
}: TProps) {
  let backgroundColor;
  let textColor;

  switch (toastType) {
    case "info":
      backgroundColor = "#B149DA";
      textColor = "#FFFFFF";
      break;
    case "success":
      backgroundColor = "#06BC0B";
      textColor = "#FFFFFF";
      break;
    case "warning":
      backgroundColor = "#FF6644";
      textColor = "#FFFFFF";
      break;
    case "error":
      backgroundColor = "#EC0047";
      textColor = "#FFFFFF";
      break;
    case "default":
      backgroundColor = "#FFFFFF";
      textColor = "#000000";
      break;
    default:
      backgroundColor = "#FFFFFF";
      textColor = "#000000";
      break;
  }

  toast(<ToastMessage messageText={messageText} />, {
    ...rest,
    position: position,
    theme: theme,
    toastId: toastId,
    type: toastType,
    style: { backgroundColor: backgroundColor, color: textColor },
  });
}
