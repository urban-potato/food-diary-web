import { FC } from "react";
import { ConsumedCharacteristicProps } from "../types/types";

const ConsumedCharacteristic: FC<ConsumedCharacteristicProps> = ({
  name,
  value,
}) => {
  return (
    <div className="gap-4 flex w-full bg-near_white shadow-md rounded-xl p-3 max-w-max justify-between">
      <p>{name}:</p>
      <div className="flex gap-x-1">
        <p>{Number(value.toFixed(2))}</p>
        {name.toLowerCase() === "калории" ? <p>ккал.</p> : <p>г.</p>}
      </div>
    </div>
  );
};

export default ConsumedCharacteristic;
