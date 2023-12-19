import { FC } from "react";
import { InputIlluminatedProps } from "./types/types";

const InputIlluminated: FC<InputIlluminatedProps> = ({
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
    <div className="">
      <label htmlFor={id} className="">
        <h3 className="flex gap-x-1">
          {placeholder}
          <p className={isRequired ? "text-red" : "hidden"}>*</p>
        </h3>
      </label>

      <div className=" relative group/input ">
        <div
          className={
            errorMessage || isError
              ? illumination.error + inset
              : illumination.base + inset
          }
        ></div>
        <input
          id={id}
          type={type}
          {...register}
          style={{ backgroundColor: errorMessage || isError ? bgError : bg }}
          className={
            errorMessage || isError
              ? "relative text-sm border-0 "
              : "relative text-sm "
          }
          // onClick={(event) => {event.stopPropagation();}}
        />
      </div>

      <p className="text-pink-500 mt-3">{errorMessage}</p>
    </div>
  );
};

export default InputIlluminated;
