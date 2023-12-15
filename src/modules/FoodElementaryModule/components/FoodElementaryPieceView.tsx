import { FC, useEffect, useRef, useState } from "react";
import FoodCharacteristic from "./FoodCharacteristic";
import {
  FoodElementaryPieceViewProps,
  IFoodCharacteristic,
} from "../types/types";
import { useDeleteFoodElementaryMutation } from "../api/foodElementary.api";
import FoodElementaryPieceEdit from "./FoodElementaryPieceEdit";

import { Player } from "@lordicon/react";

import EDIT_ICON from "../../../global/assets/system-regular-63-settings-cog.json";
// import EDIT_ICON from "../../../global/assets/system-regular-63-settings-cog (1).json";

import DELETE_ICON from "../../../global/assets/system-regular-39-trash.json";

const FoodElementaryPieceView = ({
  id,
  name,
  characteristics,
}: FoodElementaryPieceViewProps) => {
  let foodCharacteristics = characteristics.map((c: IFoodCharacteristic) => {
    return (
      <FoodCharacteristic
        key={c.foodCharacteristicId}
        characteristicTypeId={c.characteristicTypeId}
        name={c.characteristicName}
        value={c.value}
      />
    );
  });

  const [isEditMode, setIsEditMode] = useState(false);

  const [doDeleteFood, doDeleteFoodResult] = useDeleteFoodElementaryMutation();

  let deleteFood = () => {
    doDeleteFood(id);
  };

  const editIconPlayerRef = useRef<Player>(null);
  const deleteIconPlayerRef = useRef<Player>(null);
  const ICON_SIZE = 28;

  return (
    <div
      className="group/foodPiece relative 
    
    w-full max-w-5xl 
   
    my-3 
    "
    >
      <div
        className="absolute inset-0 
      
      rounded-xl 

      bg-gradient-to-r from-pink-500 to-violet-500 
      opacity-25 

      transition duration-1000 

      group-hover/foodPiece:opacity-40 
      group-hover/foodPiece:duration-500 
      group-hover/foodPiece:scale-101

      group-focus-within/foodPiece:opacity-40 
      group-focus-within/foodPiece:duration-500 
      group-focus-within/foodPiece:scale-101
      
      "
      ></div>
      <div
        className="relative flex flex-wrap w-full 
      justify-center items-start 
      
      px-6  pt-5 pb-6
     
      transition duration-1000 

      group-hover/foodPiece:duration-500 
      group-hover/foodPiece:scale-101

      group-focus-within/foodPiece:duration-500 
      group-focus-within/foodPiece:scale-101
      "
      >
        {isEditMode ? (
          <FoodElementaryPieceEdit
            key={`edit_${id}`}
            id={id}
            name={name}
            characteristics={characteristics}
            setIsEditMode={setIsEditMode}
          />
        ) : (
          <div
            key={id}
            className="flex flex-col flex-wrap w-full 
            
          "
          >
            <div className=" -mt-5 flex flex-col flex-wrap ">
              <div className=" text-xl font-bold mb-3">{name}</div>
              <div>
                <div className=" font-semibold mb-1 text-[17px]">
                  Нутриенты на 100гр:
                </div>
                <div className=" flex flex-wrap gap-x-4 ">
                  {foodCharacteristics}
                </div>
              </div>
            </div>
            <div className="order-[-1] ml-auto gap-x-2 flex justify-center items-start ">
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
        )}
      </div>
    </div>
  );
};

export default FoodElementaryPieceView;
