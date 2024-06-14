import { FC } from "react";

type TProps = {
  name: string;
};

const FoodCharacteristicTypeTile: FC<TProps> = ({ name }) => {
  return (
    <div id="nutrients" className="gap-4 flex w-full bg-near_white shadow-md rounded-xl p-3 max-w-max justify-between">
      <p className="truncate">{name}</p>
    </div>
  );
};

export default FoodCharacteristicTypeTile;
