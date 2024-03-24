import { FC } from "react";
import { ConsumedElementaryProps } from "../types/types";

const ConsumedElementary: FC<ConsumedElementaryProps> = ({
  foodElementaryName,
  elementaryInMealWeight,
}) => {
  return (
    <div className="flex gap-x-5 w-full bg-near_white shadow-md rounded-xl p-3">
      <p>{foodElementaryName}</p>{" "}
      <div className="flex gap-x-1">
        <p>{elementaryInMealWeight}</p> <p>г.</p>
      </div>
    </div>
  );
};

export default ConsumedElementary;
