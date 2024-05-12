import { FC } from "react";
import { ICharacteristicsSum } from "../../../global/types/types";
import CharacteristicsSumList from "../../../components/CharacteristicsSum/CharacteristicsSumList";

type TProps = {
  characteristicsSum: ICharacteristicsSum[];
};

const DaysCharacteristicsSum: FC<TProps> = ({ characteristicsSum }) => {
  return (
    <div
      className="bg-gradient-to-r from-pink-200 to-violet-200 shadow-lg rounded-xl p-5 
      flex flex-col flex-wrap justify-center items-start gap-3 max-w-max"
    >
      {/* {characteristicsSum.length > 0 ? (
        <CharacteristicsSumList characteristicsSum={characteristicsSum} />
      ) : (
        <div className="text-center">
          <p>Данных по нутриентам нет</p>
        </div>
      )} */}

      <CharacteristicsSumList characteristicsSum={characteristicsSum} />
    </div>
  );
};

export default DaysCharacteristicsSum;
