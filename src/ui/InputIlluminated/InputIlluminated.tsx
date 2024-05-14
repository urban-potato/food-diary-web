import { FC } from "react";

type TProps = {
  ref?: any;
  id: string;
  type: string;
  placeholder?: string | number;
  register: any;
  errorMessage?: any;
  isError?: boolean;
  inset?: string;
  bg?: string;
  bgError?: string;
  isRequired?: boolean;
  disableIllumination?: boolean;
  additionalStyles?: string;
  isDisabled?: boolean;
  addSpaceAfterLabel?: boolean;
};

const InputIlluminated: FC<TProps> = ({
  ref = undefined,
  id,
  type,
  placeholder,
  register,
  errorMessage = null,
  isError = false,
  inset = " -inset-0.5 ",
  bg = "#FFFFFF",
  bgError = "#f8e8ee",
  isRequired = false,
  disableIllumination = false,
  additionalStyles = "",
  isDisabled = false,
  addSpaceAfterLabel = false,
  ...rest
}) => {
  const illumination = {
    base:
      "absolute " +
      " bg-gradient-to-r from-purple-500 to-purple-500 " +
      " rounded-xl " +
      " blur-sm " +
      " opacity-40 " +
      " group-hover/input:opacity-70 " +
      " group-focus/input:opacity-70 " +
      " transition duration-1000 " +
      " group-hover/input:duration-500 ",
    error:
      "absolute " +
      " bg-gradient-to-r from-pink-500 to-pink-500 " +
      " rounded-xl " +
      " blur-sm " +
      " opacity-40 " +
      " group-hover/input:opacity-70 " +
      " group-focus/input:opacity-70 " +
      " transition duration-1000 " +
      " group-hover/input:duration-500 ",
  };

  return (
    <div className=" ">
      <div className="flex">
        <label htmlFor={id} className="truncate">
          <h3 className="flex gap-x-1 truncate">
            <p className="truncate">
              {placeholder}
            </p>
            <p
              className={
                isRequired
                  ? "text-red"
                  : "hidden"
              }
            >
              *
            </p>
          </h3>
        </label>
        {addSpaceAfterLabel ? (
          <div className="ml-auto gap-x-2 flex justify-center items-start w-16 flex-shrink-0"></div>
        ) : null}
      </div>

      <div className=" relative group/input ">
        {/* <div
          className={
            errorMessage || isError
              ? illumination.error + inset
              : illumination.base + inset
          }
        ></div> */}
        <div
          className={
            !disableIllumination
              ? errorMessage || isError
                ? illumination.error + inset
                : illumination.base + inset
              : ""
          }
        ></div>
        <input
          {...rest}
          ref={ref}
          id={id}
          type={type}
          {...register}
          style={{
            backgroundColor: errorMessage || isError ? bgError : bg,
            color: isDisabled ? "gray" : "black",
          }}
          className={
            errorMessage || isError
              ? "relative text-sm border-0 " + " " + additionalStyles
              : "relative text-sm " + " " + additionalStyles
          }
          // onClick={(event) => {event.stopPropagation();}}
          disabled={isDisabled}
        />
      </div>

      <p className="text-pink-500 mt-3">{errorMessage}</p>
    </div>
  );
};

export default InputIlluminated;
