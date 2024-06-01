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
  toastId: string;
  toastType: "info" | "success" | "warning" | "error" | "default";
};

export function notify({
  messageText,
  position = "top-center",
  theme = "colored",
  toastId,
  toastType,
}: TProps) {
  toast(<ToastMessage messageText={messageText} />, {
    position: position,
    theme: theme,
    toastId: toastId,
    type: toastType,
  });
}
