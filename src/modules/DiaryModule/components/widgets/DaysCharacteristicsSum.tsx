import { FC } from "react";
import { ICharacteristicsSum } from "../../../../global/types/types";
import CharacteristicTilesList from "../../../../components/CharacteristicTilesList/CharacteristicTilesList";
import { useGetAllFoodCharacteristicTypesQuery } from "../../../UserModule";

type TProps = {
  characteristicsSum: ICharacteristicsSum[];
};

const DaysCharacteristicsSum: FC<TProps> = ({ characteristicsSum }) => {
  const {
    isLoading: isLoadingFoodCharacteristicTypes,
    isSuccess: isSuccessFoodCharacteristicTypes,
    data: dataFoodCharacteristicTypes,
  } = useGetAllFoodCharacteristicTypesQuery(undefined);

  const characteristicsSumList =
    characteristicsSum.length != 0
      ? characteristicsSum
      : isSuccessFoodCharacteristicTypes &&
        dataFoodCharacteristicTypes?.items?.length > 0
      ? dataFoodCharacteristicTypes?.items
      : [];

  return (
    <div
      className="bg-gradient-to-r from-pink-200 to-violet-200 shadow-lg rounded-xl p-5 
      flex flex-col flex-wrap justify-center items-start gap-3 w-full"
    >
      <CharacteristicTilesList characteristicsList={characteristicsSumList} />
    </div>
  );
};

export default DaysCharacteristicsSum;
