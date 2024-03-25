import { FC, useRef, useState } from "react";
import MealEdit from "./MealEdit";
import ConsumedElementary from "./ConsumedElementary";
import type {
  IConsumedCharacteristic,
  IConsumedElementary,
  ICourseMeal,
} from "../types/types";

import { Player } from "@lordicon/react";

import EDIT_ICON from "../../../global/assets/system-regular-63-settings-cog.json";
import DELETE_ICON from "../../../global/assets/system-regular-39-trash.json";
import ConsumedCharacteristic from "./ConsumedCharacteristic";
import { sortConsumedCharacteristics } from "../helpers/helpers";
import { useDeleteCourseMealMutation } from "../api/meals.api";

const Meal: FC<ICourseMeal> = ({
  id,
  creationTime,
  mealTypeId,
  mealTypeName,
  consumedElementaries,
  characteristicsSum,
  ...rest
}) => {
  const [isEditMode, setIsEditMode] = useState(false);

  const [doDeleteCourseMeal] = useDeleteCourseMealMutation();

  const deleteMeal = () => {
    doDeleteCourseMeal(id).catch((e: any) => console.log(e));
  };

  const mappedConsumedElementaries = consumedElementaries.map(
    (elementary: IConsumedElementary) => {
      return (
        <ConsumedElementary
          key={`mappedConsumedElementaries_${elementary.id}`}
          foodElementaryName={elementary.foodElementary.name}
          elementaryInMealWeight={elementary.elementaryInMealWeight}
        />
      );
    }
  );

  const sortedConsumedCharacteristics =
    sortConsumedCharacteristics(characteristicsSum);

  const mappedCharacteristicsSum = sortedConsumedCharacteristics.map(
    (characteristic: IConsumedCharacteristic) => {
      return (
        <ConsumedCharacteristic
          key={`mappedCharacteristicsSum_${characteristic.foodCharacteristicType.id}`}
          name={characteristic.foodCharacteristicType.name}
          value={characteristic.characteristicSumValue}
        />
      );
    }
  );

  const editIconPlayerRef = useRef<Player>(null);
  const deleteIconPlayerRef = useRef<Player>(null);
  const ICON_SIZE = 28;

  return (
    <div className="w-full max-w-5xl mt-5 ">
      <div className="outer_box_style group w-full max-w-5xl">
        <div className="box_style "></div>
        <div className="box_content_transition flex flex-col flex-wrap w-full justify-center items-start pl-7 pr-6 py-7 gap-4">
          <div className="w-full max-w-5xl  flex justify-center items-center ">
            <div className="ml-1 flex gap-5 justify-center items-center self-center ">
              <div className="text-xl font-bold">
                {creationTime.split(".")[0].split(":").slice(0, 2).join(":")}
              </div>
              <div className="text-xl font-bold">{mealTypeName}</div>
            </div>

            <div className="mr-0 mx-auto justify-self-end gap-x-2 flex justify-center items-start ">
              <span role="button" onClick={() => setIsEditMode(!isEditMode)}>
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

              <span role="button" onClick={() => deleteMeal()}>
                <span
                  onMouseEnter={() =>
                    deleteIconPlayerRef.current?.playFromBeginning()
                  }
                >
                  <Player
                    ref={deleteIconPlayerRef}
                    icon={DELETE_ICON}
                    size={ICON_SIZE}
                    colorize="#0d0b26"
                  />
                </span>
              </span>
            </div>
          </div>

          {isEditMode ? (
            <MealEdit
              courseMealId={id}
              originalMealTypeId={mealTypeId}
              consumedElementaries={consumedElementaries}
              setIsEditMode={setIsEditMode}
            />
          ) : (
            <div className="mt-4">
              <div className="flex flex-col gap-3 max-w-max ">
                {mappedConsumedElementaries}
              </div>
              <div className="mt-5 flex flex-wrap gap-x-2 gap-y-3">
                {mappedCharacteristicsSum}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Meal;
