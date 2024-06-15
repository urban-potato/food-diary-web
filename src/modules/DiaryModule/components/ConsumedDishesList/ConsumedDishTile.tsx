import { FC } from "react";

type TProps = {
  name: string;
  weight: number;
};

const ConsumedDishTile: FC<TProps> = ({ name, weight }) => {
  return (
    <div className="overflow-hidden flex flex-wrap gap-4 w-full bg-near_white shadow-md rounded-xl p-3 justify-between items-center max-w-max">
      <p className="break-words max-w-full">{name}</p>{" "}
      <p className="flex gap-x-1">{weight} г</p>
    </div>
  );
};

export default ConsumedDishTile;
