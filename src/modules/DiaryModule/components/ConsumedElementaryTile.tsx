import { FC } from "react";

type TProps = {
  foodElementaryName: string;
  elementaryInMealWeight: number;
};

const ConsumedElementaryTile: FC<TProps> = ({
  foodElementaryName,
  elementaryInMealWeight,
}) => {
  return (
    <div className="flex gap-x-5 w-full bg-near_white shadow-md rounded-xl p-3 justify-between">
      <p>{foodElementaryName}</p>{" "}
      <div className="flex gap-x-1">
        <p>{elementaryInMealWeight}</p> <p>г.</p>
      </div>
    </div>
  );
};

export default ConsumedElementaryTile;
