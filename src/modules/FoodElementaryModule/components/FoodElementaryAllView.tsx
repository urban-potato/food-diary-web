import { FC, Key, useEffect, useRef } from "react";
import { useGetAllFoodElementaryQuery } from "../api/foodElementary.api";
import Preloader from "../../../components/Preloader/Preloader";
import FoodElementaryPieceView from "./FoodElementaryPieceView";
import { IFoodElementaryItem } from "../types/types";

import { Player } from "@lordicon/react";
// import { Player } from "@lottiefiles/react-lottie-player";

import PRELOADER from "../../../global/assets/system-regular-18-autorenew.json";

const PROTEIN_DEFAULT_ID = "0141a646-e0ce-4f7a-9433-97112f05db0f";
const FAT_DEFAULT_ID = "d126d15b-853a-4b7e-b122-af811a160609";
const CARBOHYDRATE_DEFAULT_ID = "e3c6d689-4f63-44ff-8844-5bd11e4ed5af";
const CALORIES_DEFAULT_ID = "cdcc58c7-5c5f-454a-9728-0643afccf491";

const FoodElementaryAllView: FC = () => {
  const {
    isLoading: isLoadingGetAllFoodElementary,
    data: dataGetAllFoodElementary,
    error: errorGetAllFoodElementary,
  } = useGetAllFoodElementaryQuery(undefined);

  let totalFoodCount: number = dataGetAllFoodElementary?.metadata.totalCount;

  // console.log(dataGetAllFoodElementary);

  let foodItems = dataGetAllFoodElementary?.items.map(
    (item: IFoodElementaryItem) => {
      let parsedItem = JSON.parse(JSON.stringify(item));

      let parsedCharacteristics = JSON.parse(
        JSON.stringify(parsedItem.characteristics)
      );

      let preparedCharacteristics = parsedCharacteristics.map((c) => {
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
        c.key = c.foodCharacteristicId;
        return c;
      });

      function compare(a, b) {
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

      parsedItem.key = parsedItem.id;

      return parsedItem;
    }
  );

  foodItems?.sort((a, b) => a.name.localeCompare(b.name));
  // foodItems?.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

  let foodItemsSorted = foodItems?.map((item) => {
    return (
      <FoodElementaryPieceView
        key={item.id}
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

      {/* {isLoadingGetAllFoodElementary ? <Preloader /> : null} */}
      {isLoadingGetAllFoodElementary ? (
        <span className="m-10">
          <Player
            ref={preloaderPlayerRef}
            icon={PRELOADER}
            size={100}
            colorize="#0d0b26"
            onComplete={() => preloaderPlayerRef.current?.playFromBeginning()}
          />

          {/* <Player
            src={PRELOADER}
            className="player"
            loop
            autoplay
            style={{ height: "100px", width: "100px", color: "#FF7777CC" }}
          /> */}
        </span>
      ) : null}
    </div>
  );
};

export default FoodElementaryAllView;
