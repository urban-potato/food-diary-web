import { FC } from "react";

type TProps = {
  name: string;
  value: number;
};

const CharacteristicTile: FC<TProps> = ({ name, value }) => {
  return (
    <div className="truncate gap-4 flex w-full bg-near_white shadow-md rounded-xl p-3 max-w-max justify-between">
      <p className="truncate">{name}:</p>
      <div className="flex gap-x-1 truncate">
        <p className="">{Number(value.toFixed(2))}</p>
        {name.toLowerCase() === "калории" ? (
          <p className="">ккал.</p>
        ) : (
          <p className="">г.</p>
        )}
      </div>
    </div>
  );
};

export default CharacteristicTile;
