import { FC } from "react";

type TProps = {
  name: string;
  weight: number;
};

const ConsumedDishTile: FC<TProps> = ({ name, weight }) => {
  return (
    <div className="truncate flex gap-4 w-full bg-near_white shadow-md rounded-xl p-3 justify-between max-w-max">
      <p className="truncate">{name}</p>{" "}
      <div className="flex gap-x-1">
        <p>{weight}</p> <p>г.</p>
      </div>
    </div>
  );
};

export default ConsumedDishTile;
