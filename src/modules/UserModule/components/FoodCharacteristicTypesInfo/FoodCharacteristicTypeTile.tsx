import { FC } from "react";

type TProps = {
  name: string;
};

const FoodCharacteristicTypeTile: FC<TProps> = ({ name }) => {
  return (
    <div className="gap-4 flex w-full bg-near_white shadow-md rounded-xl p-3 max-w-max justify-between">
      <p className="truncate">{name}</p>
      {/* <div className="flex gap-x-1">
        <p>{Number(value.toFixed(2))}</p>
        {name.toLowerCase() === "калории" ? <p>ккал.</p> : <p>г.</p>}
      </div> */}
    </div>
  );
};

export default FoodCharacteristicTypeTile;
