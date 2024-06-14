import { FC, useRef, useState } from "react";
import FoodCharacteristicTypesInfoEditForm from "./FoodCharacteristicTypesInfoEditForm";
import FoodCharacteristicTypesInfoTileBody from "./FoodCharacteristicTypesInfoTileBody";
import { IFoodCharacteristicType } from "../../../global/types/entities-types";
import { sortCharacteristics } from "../../../global/helpers/sort-characteristics.helper";
import { Player } from "@lordicon/react";
import EDIT_ICON from "../../../global/assets/settings.json";
import { useGetAllFoodCharacteristicTypesQuery } from "../api/food-characteristic-type.api";
import Preloader from "../../../components/Preloader/Preloader";
import { useAppDispatch } from "../../../global/store/store-hooks";
import { useNavigate } from "react-router-dom";
import { handleApiCallError } from "../../../global/helpers/handle-api-call-error.helper";

const FoodCharacteristicTypesInfoTile: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    isLoading: isLoadingFoodCharacteristicTypes,
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

  const foodCharacteristicTypes: IFoodCharacteristicType[] =
    dataFoodCharacteristicTypes?.items?.length > 0
      ? dataFoodCharacteristicTypes?.items
      : [];

  const [isEditMode, setIsEditMode] = useState(false);

  const editIconPlayerRef = useRef<Player>(null);
  const ICON_SIZE = 28;

  const sortedFoodCharacteristicTypes: IFoodCharacteristicType[] =
    sortCharacteristics(foodCharacteristicTypes);

  sortedFoodCharacteristicTypes.splice(3, 1);

  return (
    <section className="flex flex-col justify-center items-center w-full gap-5">
      {!dataFoodCharacteristicTypes ||
      dataFoodCharacteristicTypes?.items?.length < 1 ? (
        <span className="m-10">
          <Preloader />
        </span>
      ) : (
        <div className="outer_box_style group w-full max-w-5xl">
          <div className="box_style"></div>
          <div className="box_content_transition flex flex-wrap w-full justify-center items-start p-7">
            <div className="ml-auto gap-x-2 flex justify-center items-start">
              <span
                role="button"
                className="remove_tap_highlight"
                onClick={() => setIsEditMode(!isEditMode)}
              >
                <span
                  onMouseEnter={() =>
                    editIconPlayerRef.current?.playFromBeginning()
                  }
                >
                  <Player
                    ref={editIconPlayerRef}
                    icon={EDIT_ICON}
                    size={ICON_SIZE}
                    colorize="#0d0b26"
                  />
                </span>
              </span>
            </div>
            {isEditMode ? (
              <FoodCharacteristicTypesInfoEditForm
                originalFoodCharacteristicTypes={sortedFoodCharacteristicTypes}
                isEditMode={isEditMode}
                setIsEditMode={setIsEditMode}
              />
            ) : (
              <FoodCharacteristicTypesInfoTileBody
                foodCharacteristicTypes={sortedFoodCharacteristicTypes}
              />
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default FoodCharacteristicTypesInfoTile;
