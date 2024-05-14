import { FC } from "react";

type TProps = {
  name: string;
};

const NameTile: FC<TProps> = ({ name }) => {
  return (
    <div className="gap-4 flex w-full bg-near_white shadow-md rounded-xl p-3 max-w-max justify-between">
      <p className="text-lg font-bold text-ellipsis overflow-hidden">{name}</p>
    </div>
  );
};

export default NameTile;
