import { FC, useRef, useState } from "react";
import FoodCharacteristic from "./FoodCharacteristic";
import { FoodElementaryPieceProps, IFoodCharacteristic } from "../types/types";
import { useDeleteFoodElementaryMutation } from "../api/foodElementary.api";
import FoodElementaryPieceEdit from "./FoodElementaryPieceEdit";
import { Player } from "@lordicon/react";

import EDIT_ICON from "../../../global/assets/system-regular-63-settings-cog.json";
import DELETE_ICON from "../../../global/assets/system-regular-39-trash.json";

const FoodElementaryPiece: FC<FoodElementaryPieceProps> = ({
  id,
  name,
  characteristics,
}) => {
  let foodCharacteristics = characteristics.map((c: IFoodCharacteristic) => {
    return (
      <FoodCharacteristic
        key={`${c.foodCharacteristicId}_foodCharacteristics`}
        name={c.characteristicName}
        value={c.value}
      />
    );
  });

  const [isEditMode, setIsEditMode] = useState(false);

  const [doDeleteFood] = useDeleteFoodElementaryMutation();

  let deleteFood = () => {
    doDeleteFood(id);
  };

  const editIconPlayerRef = useRef<Player>(null);
  const deleteIconPlayerRef = useRef<Player>(null);
  const ICON_SIZE = 28;

  return (
    <div className="group relative w-full max-w-5xl my-3">
      <div className="box_style"></div>
      <div className="box_content_transition flex flex-wrap w-full justify-center items-start pl-7 pr-6 py-7">
        {isEditMode ? (
          <FoodElementaryPieceEdit
            key={`edit_${id}`}
            id={id}
            name={name}
            characteristics={characteristics}
            setIsEditMode={setIsEditMode}
          />
        ) : (
          <div key={`not_edit_${id}`} className="flex flex-col  w-full">
            <div className="flex w-full">
              <div className="text-xl font-bold mb-3 text-ellipsis overflow-hidden">
                <p className="text-ellipsis overflow-hidden">{name}</p>
              </div>
              <div className="-mt-2 ml-auto gap-x-2 flex justify-center items-start">
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
              </div>
            </div>
            <div className="flex flex-col text-ellipsis overflow-hidden w-full">
              <div className="font-semibold mb-1 text-[17px] text-ellipsis overflow-hidden">
                Нутриенты на 100гр:
              </div>
              <div className="flex flex-wrap gap-x-4">
                {foodCharacteristics}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodElementaryPiece;
