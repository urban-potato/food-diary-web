import { FC } from "react";

type TProps = {
  name: string;
  value: number;
};

const CharacteristicTile: FC<TProps> = ({ name, value }) => {
  const isCalories = name.toLowerCase() === "калории" ? true : false;

  return isCalories ? (
    <div className="relative group">
      <div
        className="absolute inset-0 
        bg-gradient-to-r from-purple-500 to-purple-500 
      rounded-xl blur-xs opacity-80"
      ></div>
      <div
        className="relative transition  
      truncate flex gap-4 w-full bg-near_white shadow-md rounded-xl p-3 justify-between max-w-max"
      >
        <p className="truncate">{name}:</p>
        <div className="flex gap-x-1">
          <p className="">{Number(value.toFixed(3))}</p>
          <p>ккал.</p>
        </div>
      </div>
    </div>
  ) : (
    <div className="truncate flex gap-4 w-full bg-near_white shadow-md rounded-xl p-3 justify-between max-w-max">
      <p className="truncate">{name}:</p>
      <div className="flex gap-x-1">
        <p className="">{Number(value.toFixed(3))}</p>
        <p>г.</p>
      </div>
    </div>
  );
};

export default CharacteristicTile;
