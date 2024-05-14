import { FC, useRef, useState } from "react";
import { useDeleteFoodElementaryMutation } from "../../api/foodElementary.api";
import FoodElementaryEditForm from "./FoodElementaryEditForm";
import { Player } from "@lordicon/react";

import EDIT_ICON from "../../../../global/assets/system-regular-63-settings-cog.json";
import DELETE_ICON from "../../../../global/assets/system-regular-39-trash.json";
import FoodElementaryInfo from "./FoodElementaryInfo";
import { IFoodCharacteristic } from "../../../../global/types/types";

type TProps = {
  id: string;
  name: string;
  characteristics: IFoodCharacteristic[];
};

const FoodElementaryTile: FC<TProps> = ({ id, name, characteristics }) => {
  const [isEditMode, setIsEditMode] = useState(false);

  const [doDeleteFood] = useDeleteFoodElementaryMutation();

  let deleteFood = () => {
    doDeleteFood(id);
  };

  const editIconPlayerRef = useRef<Player>(null);
  const deleteIconPlayerRef = useRef<Player>(null);
  const ICON_SIZE = 28;

  return (
    <div className="outer_box_style group w-full max-w-5xl mt-5">
      <div className="box_style"></div>
      <div className="box_content_transition flex flex-col flex-wrap w-full justify-center items-start pl-7 pr-6 py-7">
        <section className="ml-auto gap-x-2 flex justify-center items-start">
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

          <span role="button" onClick={() => deleteFood()}>
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
        </section>

        {isEditMode ? (
          <FoodElementaryEditForm
            key={`edit_${id}`}
            foodElementaryId={id}
            foodElementaryName={name}
            originalCharacteristics={characteristics}
            setIsEditMode={setIsEditMode}
          />
        ) : (
          <FoodElementaryInfo
            foodElementaryName={name}
            characteristics={characteristics}
          />
        )}
      </div>
    </div>
  );
};

export default FoodElementaryTile;
