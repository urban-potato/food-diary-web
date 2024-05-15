import { FC } from "react";

type TProps = {
  name: string;
  value: number;
};

const CharacteristicTile: FC<TProps> = ({ name, value }) => {
  return (
    <div className="truncate flex gap-4 w-full bg-near_white shadow-md rounded-xl p-3 justify-between max-w-max">
      <p className="truncate">{name}:</p>
      <div className="flex gap-x-1">
        <p className="">{Number(value.toFixed(2))}</p>
        {name.toLowerCase() === "калории" ? <p>ккал.</p> : <p>г.</p>}
      </div>
    </div>
  );
};

export default CharacteristicTile;
