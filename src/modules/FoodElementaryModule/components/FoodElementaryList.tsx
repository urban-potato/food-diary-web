import { FC, useEffect, useRef } from "react";
import { useGetAllFoodElementaryQuery } from "../api/foodElementary.api";
import FoodElementaryPiece from "./FoodElementaryPiece.tsx";
import {
  IFoodCharacteristic,
  IFoodElementary,
  ILocalFoodCharacteristic,
} from "../types/types";
import { Player } from "@lordicon/react";

import PRELOADER from "../../../global/assets/system-regular-18-autorenew.json";
import {
  CALORIES_DEFAULT_ID,
  CARBOHYDRATE_DEFAULT_ID,
  FAT_DEFAULT_ID,
  PROTEIN_DEFAULT_ID,
} from "../constants/constants.ts";

const FoodElementaryList: FC = () => {
  const {
    isLoading: isLoadingGetAllFoodElementary,
    data: dataGetAllFoodElementary,
    error: errorGetAllFoodElementary,
  } = useGetAllFoodElementaryQuery(undefined);

  let totalFoodCount: number = dataGetAllFoodElementary?.metadata.totalCount;

  // console.log(dataGetAllFoodElementary);

  let foodItems = dataGetAllFoodElementary?.items.map(
    (item: IFoodElementary) => {
      let parsedItem = JSON.parse(JSON.stringify(item));

      let parsedCharacteristics = JSON.parse(
        JSON.stringify(parsedItem.characteristics)
      );

      let preparedCharacteristics = parsedCharacteristics.map(
        (c: ILocalFoodCharacteristic) => {
          let localId = 4;

          if (c.characteristicTypeId.toLowerCase() === PROTEIN_DEFAULT_ID) {
            c.localId = 0;
          } else if (c.characteristicTypeId.toLowerCase() === FAT_DEFAULT_ID) {
            c.localId = 1;
          } else if (
            c.characteristicTypeId.toLowerCase() === CARBOHYDRATE_DEFAULT_ID
          ) {
            c.localId = 2;
          } else if (
            c.characteristicTypeId.toLowerCase() === CALORIES_DEFAULT_ID
          ) {
            c.localId = 3;
          } else {
            c.localId = localId;
            localId++;
          }

          return c;
        }
      );

      function compare(
        a: ILocalFoodCharacteristic,
        b: ILocalFoodCharacteristic
      ) {
        if (a.localId < b.localId) {
          return -1;
        }
        if (a.localId > b.localId) {
          return 1;
        }
        return 0;
      }

      preparedCharacteristics.sort(compare);

      parsedItem.characteristics = preparedCharacteristics;

      parsedItem.key = `${parsedItem.id}_foodItems`;

      return parsedItem;
    }
  );

  foodItems?.sort((a: IFoodElementary, b: IFoodElementary) =>
    a.name.localeCompare(b.name)
  );
  // foodItems?.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

  let foodItemsSorted = foodItems?.map((item: IFoodElementary) => {
    return (
      <FoodElementaryPiece
        key={`${item.id}_foodItemsSorted`}
        id={item.id}
        name={item.name}
        characteristics={item.characteristics}
      />
    );
  });

  const preloaderPlayerRef = useRef<Player>(null);

  useEffect(() => {
    preloaderPlayerRef.current?.playFromBeginning();
  });

  return (
    <div
      className="w-full max-w-full
    flex flex-col justify-center items-center
    mt-3
    
    "
    >
      <div className="text-2xl font-bold  ">
        Всего простых блюд: {totalFoodCount}
      </div>

      {foodItemsSorted}

      {isLoadingGetAllFoodElementary ? (
        <span className="m-10">
          <Player
            ref={preloaderPlayerRef}
            icon={PRELOADER}
            size={100}
            colorize="#0d0b26"
            onComplete={() => preloaderPlayerRef.current?.playFromBeginning()}
          />
        </span>
      ) : null}
    </div>
  );
};

export default FoodElementaryList;
