import { FC, useRef, useState } from "react";
import { Player } from "@lordicon/react";
import EDIT_ICON from "../../../global/assets/system-regular-63-settings-cog.json";
import DELETE_ICON from "../../../global/assets/system-regular-39-trash.json";
import { useDeleteCourseMealMutation } from "../api/meals.api";
import type { ICourseMeal } from "../types/types";
import MealEdit from "./MealEdit";
import MealElementaries from "./MealElementaries";
import MealCharacteristicsSum from "./MealCharacteristicsSum";

const MealTile: FC<ICourseMeal> = ({
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
              <MealElementaries consumedElementaries={consumedElementaries} />
              <MealCharacteristicsSum characteristicsSum={characteristicsSum} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MealTile;
