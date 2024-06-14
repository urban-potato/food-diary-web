import { FC } from "react";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "../../global/helpers/cn.helper";

type TProps = {
  illuminationVariant?: VariantProps<
    typeof illuminationVariants
  >["illuminationVariant"];
  buttonVariant?: VariantProps<typeof buttonVariants>["buttonVariant"];
  isDisabled?: boolean;
  illuminationClassName?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const illuminationVariants = cva("absolute rounded-full -inset-0.5", {
  variants: {
    illuminationVariant: {
      light:
        "bg-gradient-to-r from-purple-500 to-purple-500 blur-sm opacity-40 group-hover/illuminatedButton:opacity-80 group-focus/illuminatedButton:opacity-80 transition duration-1000 group-hover/illuminatedButton:duration-500",
      full: "bg-gradient-to-r from-purple-500 to-purple-500 blur-sm opacity-80",
      disabled: "",
    },
  },
  defaultVariants: {
    illuminationVariant: "disabled",
  },
});

const buttonVariants = cva(
  "p-[14px] relative flex-grow flex-shrink flex justify-center items-center rounded-full truncate transition duration-1000 hover:duration-500",
  {
    variants: {
      buttonVariant: {
        light: "remove_tap_highlight bg-[#fff] text-near_black",
        dark: "remove_tap_highlight bg-near_black text-near_white",
        disabled:
          "cursor-default bg-light_near_black text-near_white border-light_near_black",
      },
    },
    defaultVariants: {
      buttonVariant: "dark",
    },
  }
);

const ButtonIlluminated: FC<TProps> = ({
  illuminationVariant,
  buttonVariant,
  isDisabled = false,
  illuminationClassName,
  className,
  children,
  ...rest
}) => {
  return (
    <div className="relative group/illuminatedButton flex">
      <div
        className={cn(
          illuminationVariants({
            illuminationVariant: isDisabled ? "disabled" : illuminationVariant,
          }),
          illuminationClassName
        )}
      ></div>
      <button
        {...rest}
        className={cn(
          buttonVariants({
            buttonVariant: isDisabled ? "disabled" : buttonVariant,
          }),
          className
        )}
        disabled={isDisabled}
      >
        {children}
      </button>
    </div>
  );
};

export default ButtonIlluminated;
