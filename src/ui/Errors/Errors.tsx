import { FC } from "react";
import ShortUniqueId from "short-unique-id";
import { cn } from "../../global/helpers/cn.helper";

type TProps = {
  errorMessagesList: Array<string>;
} & React.HTMLAttributes<HTMLDivElement>;

const Errors: FC<TProps> = ({ errorMessagesList, className }) => {
  const uid = new ShortUniqueId({ length: 32 });
  const errors = errorMessagesList.map((message) => (
    <p key={`${uid.rnd()}_${message}`}>{message}</p>
  ));

  return (
    <div
      className={cn(
        "flex flex-col mt-1 justify-center items-start text-pink-500 text-base",
        className
      )}
    >
      {errors}
    </div>
  );
};

export default Errors;
