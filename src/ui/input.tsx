import { FC } from "react";

interface PropsType {
  id: string;
  type: string;
  placeholder?: string | number;
  register: any;
  errorMessage: any;
  bg?: string | null;
}

const Input: FC<PropsType> = ({
  id,
  type,
  placeholder,
  register,
  errorMessage,
  // bg = "#1B1B23",
  bg = "#FFFFFF",
}) => {
  return (
    <div className="">
      <label htmlFor={id} className="">
        {placeholder}
      </label>
      <input
        id={id}
        type={type}
        {...register}
        style={{ backgroundColor: bg }}
        className=""
      />
      <p className="">{errorMessage}</p>
    </div>
  );
};

export default Input;
