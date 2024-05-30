import { FC } from "react";
import ShortUniqueId from "short-unique-id";

type TProps = {
  errorMessagesList: Array<string>;
};

const Errors: FC<TProps> = ({ errorMessagesList }) => {
  const uid = new ShortUniqueId({ length: 32 });
  const errors = errorMessagesList.map((message) => (
    <p key={`${uid.rnd()}_${message}`}>{message}</p>
  ));

  return (
    <div className="flex flex-col mt-1 justify-center items-start text-pink-500">
      {errors}
    </div>
  );
};

export default Errors;
