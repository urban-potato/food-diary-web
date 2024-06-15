import { FC } from "react";

type TProps = {
  name: string;
  value: number;
};

const CharacteristicTile: FC<TProps> = ({ name, value }) => {
  const isCalories = name.toLowerCase() === "калории" ? true : false;

  return isCalories ? (
    <div className="relative group break-words max-w-full">
      <div
        className="absolute inset-0 
        bg-gradient-to-r from-purple-500 to-purple-500 
      rounded-xl blur-xs opacity-80"
      ></div>
      <div
        className="overflow-hidden relative transition  
       flex flex-wrap gap-4 w-full max-w-max bg-near_white shadow-md rounded-xl p-3 justify-between items-center "
      >
        <p className="break-all">{name}:</p>
        <p className="flex gap-x-1 break-words max-w-full">
          {Number(value.toFixed(3))} ккал
        </p>
      </div>
    </div>
  ) : (
    <div className="overflow-hidden flex flex-wrap gap-4 w-full max-w-max bg-near_white shadow-md rounded-xl p-3 justify-between items-center ">
      <p className="break-words max-w-full">{name}:</p>
      <p className="flex gap-x-1 break-words max-w-full">
        {Number(value.toFixed(3))} г
      </p>
    </div>
  );
};

export default CharacteristicTile;
