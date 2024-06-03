import { FC } from "react";
import { ICharacteristicsSum } from "../../../../global/types/entities-types";
import CharacteristicTilesList from "../../../../components/CharacteristicTilesList/CharacteristicTilesList";
import { useGetAllFoodCharacteristicTypesQuery } from "../../../UserInfoTile";
import { useAppDispatch } from "../../../../global/store/store-hooks";
import { useNavigate } from "react-router-dom";
import { handleApiCallError } from "../../../../global/helpers/handle-api-call-error.helper";

type TProps = {
  characteristicsSum: ICharacteristicsSum[];
};

const DayCharacteristicsSumTile: FC<TProps> = ({ characteristicsSum }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    isLoading: isLoadingFoodCharacteristicTypes,
    isSuccess: isSuccessFoodCharacteristicTypes,
    data: dataFoodCharacteristicTypes,
    isError: isErrorFoodCharacteristicTypes,
    error: errorFoodCharacteristicTypes,
  } = useGetAllFoodCharacteristicTypesQuery(undefined);

  if (
    isErrorFoodCharacteristicTypes &&
    errorFoodCharacteristicTypes &&
    "status" in errorFoodCharacteristicTypes
  ) {
    handleApiCallError({
      error: errorFoodCharacteristicTypes,
      dispatch: dispatch,
      navigate: navigate,
    });
  }

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

export default DayCharacteristicsSumTile;
