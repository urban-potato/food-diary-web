import { FC } from "react";
import { FoodCharacteristicProps } from "../types/types";

const FoodCharacteristic: FC<FoodCharacteristicProps> = ({ name, value }) => {
  return (
    <div className="flex gap-x-1 flex-wrap text-ellipsis overflow-hidden ">
      <p className="text-ellipsis overflow-hidden  ">{name}:</p>
      <p className="text-ellipsis overflow-hidden">{value}</p>
    </div>
  );
};

export default FoodCharacteristic;
