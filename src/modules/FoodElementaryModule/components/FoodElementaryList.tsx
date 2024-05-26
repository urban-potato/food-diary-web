import { FC } from "react";
import { useGetAllFoodElementaryQuery } from "../api/foodElementary.api";
import FoodElementaryTile from "./FoodElementaryTile/FoodElementaryTile.tsx";
import { ILocalFoodCharacteristic } from "../types/types";
import { IFoodElementary } from "../../../global/types/types.ts";
import {
  CALORIES_DEFAULT_ID,
  CARBOHYDRATE_DEFAULT_ID,
  FAT_DEFAULT_ID,
  PROTEIN_DEFAULT_ID,
} from "../../../global/constants/constants.ts";
import Preloader from "../../../components/Preloader/Preloader.tsx";

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

  let foodElementariesTiles = foodItems?.map((item: IFoodElementary) => {
    return (
      <FoodElementaryTile
        key={`${item.id}_foodItemsSorted`}
        id={item.id}
        name={item.name}
        characteristics={item.characteristics}
      />
    );
  });

  return (
    <div className="w-full max-w-full flex flex-col justify-center items-center mt-3">
      <div className="text-2xl font-bold  ">
        Всего простых блюд: {totalFoodCount}
      </div>

      {isLoadingGetAllFoodElementary ? (
        <span className="m-10">
          <Preloader />
        </span>
      ) : !foodElementariesTiles || foodElementariesTiles.length == 0 ? (
        <div className="w-full  flex flex-col justify-center items-center mt-10 text-xl">
          Простых блюд нет
        </div>
      ) : (
        <div className="w-full flex flex-col justify-center items-center">
          {foodElementariesTiles}
        </div>
      )}
    </div>
  );
};

export default FoodElementaryList;
