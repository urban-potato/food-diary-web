import React, { FC } from "react";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "../../global/helpers/cn.helper";
import Errors from "../Errors/Errors";

type TProps = {
  id: string;
  inputLabel?: string | number;
  register: any;
  isError?: boolean;
  bg?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  isSpaceAfterLabelNeeded?: boolean;
  illuminationVariant?: VariantProps<
    typeof illuminationVariants
  >["illuminationVariant"];
  labelClassName?: string;
  illuminationClassName?: string;
  errorMessagesList?: Array<string>;
} & React.InputHTMLAttributes<HTMLInputElement> &
  React.ClassAttributes<HTMLInputElement>;

const illuminationVariants = cva(
  "absolute -inset-0.5 rounded-xl blur-sm opacity-40 group-hover/input:opacity-70 group-focus/input:opacity-70 transition duration-1000 group-hover/input:duration-500",
  {
    variants: {
      illuminationVariant: {
        base: "bg-gradient-to-r from-purple-500 to-purple-500",
        error: "bg-gradient-to-r from-pink-500 to-pink-500",
        disabled: "",
      },
    },
    defaultVariants: {
      illuminationVariant: "disabled",
    },
  }
);

const InputIlluminated: FC<TProps> = ({
  id,
  inputLabel,
  register,
  bg = "#FFFFFF",
  isRequired = false,
  isError = false,
  isDisabled = false,
  isSpaceAfterLabelNeeded = false,
  illuminationVariant,
  labelClassName,
  illuminationClassName,
  className,
  errorMessagesList = [],
  ...rest
}) => {
  return (
    <section className="flex flex-col w-full max-w-full">
      <div className="flex mb-1 w-full max-w-full">
        <label
          htmlFor={id}
          className={cn("block w-full max-w-full", labelClassName)}
        >
          <h3 className="flex gap-x-1 overflow-hidden w-full max-w-full">
            <p className="brake-words w-max max-w-full">{inputLabel}</p>
            <p className={isRequired ? "text-red w-max" : "hidden"}>*</p>
          </h3>
        </label>
        {isSpaceAfterLabelNeeded ? (
          <div className="ml-auto gap-x-2 flex justify-center items-start w-16 flex-shrink-0"></div>
        ) : null}
      </div>

      <div className="relative group/input">
        <div
          className={cn(
            illuminationVariants({
              illuminationVariant:
                isError && illuminationVariant == "base"
                  ? "error"
                  : illuminationVariant,
            }),
            illuminationClassName
          )}
        ></div>
        <input
          {...register}
          {...rest}
          id={id}
          style={{
            backgroundColor: bg,
            // color: isDisabled ? "gray" : "black",
            color: "black",
          }}
          className={cn("relative text-sm border-0", className)}
          disabled={isDisabled}
        />
      </div>

      {isError && errorMessagesList.length > 0 && (
        <Errors errorMessagesList={errorMessagesList} />
      )}
    </section>
  );
};

export default InputIlluminated;
