import { FC } from "react";

type TProps = {
  name: string;
  weight: number;
};

const IngredientTile: FC<TProps> = ({ name, weight }) => {
  return (
    <div className="flex gap-x-5 w-full bg-near_white shadow-md rounded-xl p-3 justify-between">
      <p>{name}</p>{" "}
      <div className="flex gap-x-1">
        <p>{weight}</p> <p>г.</p>
      </div>
    </div>
  );
};

export default IngredientTile;
