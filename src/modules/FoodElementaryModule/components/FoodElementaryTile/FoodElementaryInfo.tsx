import { FC } from "react";
import { IFoodCharacteristic } from "../../../../global/types/entities-types";
import CharacteristicTilesList from "../../../../components/CharacteristicTilesList/CharacteristicTilesList";
import { CALORIES_DEFAULT_ID } from "../../../../global/constants/constants";

type TProps = {
  foodElementaryName: string;
  characteristics: IFoodCharacteristic[];
};

const FoodElementaryInfo: FC<TProps> = ({
  foodElementaryName,
  characteristics,
}) => {
  const nutrients = characteristics.filter(
    (item) => item.characteristicTypeId != CALORIES_DEFAULT_ID
  );

  const calories = characteristics.filter(
    (item) => item.characteristicTypeId == CALORIES_DEFAULT_ID
  );

  return (
    <section className="flex flex-col w-full gap-5">
      <div className="flex w-full">
        <p className="text-xl font-bold break-words max-w-full flex-shrink-1 flex-grow-1">
          {foodElementaryName}
        </p>
      </div>

      <div className="flex flex-col w-full">
        <div className="font-semibold mb-1 text-[17px] break-all">
          Калорийность на 100 г:
        </div>
        <div className="flex flex-wrap gap-3 w-full">
          <CharacteristicTilesList characteristicsList={calories} />
        </div>
      </div>

      <div className="flex flex-col w-full">
        <div className="font-semibold mb-1 text-[17px] break-all">
          Нутриенты на 100 г:
        </div>
        <div className="flex flex-wrap gap-3 w-full">
          <CharacteristicTilesList characteristicsList={nutrients} />
        </div>
      </div>
    </section>
  );
};

export default FoodElementaryInfo;
