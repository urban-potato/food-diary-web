import { FC } from "react";
import { ICharacteristicsSum } from "../../../../global/types/entities-types";
import NutrientsChart from "../../../../ui/BaseNutrientsChart/NutrientsChart";
import {
  CALORIES_DEFAULT_ID,
  CARBOHYDRATE_DEFAULT_ID,
  FAT_DEFAULT_ID,
  PROTEIN_DEFAULT_ID,
} from "../../../../global/constants/constants";

type TProps = {
  nutrientsCaloriesData: ICharacteristicsSum[];
};

const BaseNutrientsChartTile: FC<TProps> = ({ nutrientsCaloriesData }) => {
  const calories = nutrientsCaloriesData.find(
    (item) => item.foodCharacteristicType.id == CALORIES_DEFAULT_ID
  )?.characteristicSumValue!;

  const proteinsCalc =
    nutrientsCaloriesData.find(
      (item) => item.foodCharacteristicType.id == PROTEIN_DEFAULT_ID
    )?.characteristicSumValue! * 4;

  const fatsCalc =
    nutrientsCaloriesData.find(
      (item) => item.foodCharacteristicType.id == FAT_DEFAULT_ID
    )?.characteristicSumValue! * 9;

  const carbohydratesCalc =
    nutrientsCaloriesData.find(
      (item) => item.foodCharacteristicType.id == CARBOHYDRATE_DEFAULT_ID
    )?.characteristicSumValue! * 4;

  const caloriesCalc = proteinsCalc + fatsCalc + carbohydratesCalc;

  const proteinsPercentage = proteinsCalc / calories;
  const fatsPercentage = fatsCalc / calories;
  const carbohydratesPercentage = carbohydratesCalc / calories;

  const isRestNutrientsNeeded = calories > caloriesCalc;

  const preparedData = [
    {
      name: "Белки",
      value: proteinsPercentage,
    },
    {
      name: "Жиры",
      value: fatsPercentage,
    },
    {
      name: "Углеводы",
      value: carbohydratesPercentage,
    },
    {
      name: "Прочее",
      value: isRestNutrientsNeeded ? (calories - caloriesCalc) / calories : 0,
    },
  ];

  const resultData = preparedData.filter(
    (item) => item.value != 0 && !Number.isNaN(item.value)
  );

  return (
    <div className="outer_box_style group w-full max-w-5xl mt-5">
      <div className="box_style"></div>
      <div
        className="box_content_transition bg-gradient-to-r from-pink-200 to-violet-200 shadow-lg rounded-xl p-5 
      flex flex-col flex-wrap justify-center items-start h-full w-full max-w-max"
      >
        <NutrientsChart
          labelsList={resultData.map((item) => item.name)}
          dataList={resultData.map((item) => item.value)}
        />
      </div>
    </div>
  );
};

export default BaseNutrientsChartTile;
