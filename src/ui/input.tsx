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
        <h3>{placeholder}</h3>
      </label>

      <div className="relative group ">
            <div className={errorMessage ? ("absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-pink-500 rounded-xl blur-sm opacity-40 group-hover:opacity-70 group-focus:opacity-70 transition duration-1000 group-hover:duration-200 ") 
            : ("absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-purple-500 rounded-xl blur-sm opacity-40 group-hover:opacity-70 group-focus:opacity-70 transition duration-1000 group-hover:duration-200 ")}></div>
      <input
        id={id}
        type={type}
        {...register}
        // style={{ backgroundColor: bg }}
        style={{ backgroundColor: errorMessage ? "#f8e8ee" : bg }}
        
        // className="relative text-sm"
        className={errorMessage ? "relative text-sm border-0" : "relative text-sm"}

        // className="text-sm"

      />
      </div>

      <p className="text-pink-500 mt-3">{errorMessage}</p>
    </div>
  );

  // return (
  //   <div className="">
  //     <label htmlFor={id} className="">
  //       <h3>{placeholder}</h3>
  //     </label>
  //     <input
  //       id={id}
  //       type={type}
  //       {...register}
  //       style={{ backgroundColor: bg }}
  //       className=""
  //     />
  //     <p className="text-red-500">{errorMessage}</p>
  //   </div>
  // );
};

export default Input;
