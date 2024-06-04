import { FC } from "react";
import { ICharacteristicsSum } from "../../../../global/types/entities-types";
import DoughnutChart from "../../../../ui/DoughnutChart/DoughnutChart";
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

  const filteredData = preparedData.filter(
    (item) => item.value != 0 && !Number.isNaN(item.value)
  );

  const resultLabelsList =
    filteredData.length > 0
      ? filteredData.map((item) => item.name)
      : ["Белки", "Жиры", "Углеводы"];

  const resultDataList =
    filteredData.length > 0
      ? filteredData.map((item) => item.value)
      : [30, 20, 50];

  return (
    <div className="outer_box_style group h-full w-full max-w-max mt-1">
      <div className="box_style"></div>
      <div
        className="box_content_transition shadow-lg p-5 
      flex flex-col flex-wrap justify-center items-start h-full w-full max-w-max"
      >
        <div className="w-full flex justify-center items-center text-center mb-3">
          <p className="font-semibold">Доля БЖУ в калорийности</p>
        </div>

        <DoughnutChart
          labelsList={resultLabelsList}
          dataList={resultDataList}
          showDefault={filteredData.length > 0 ? false : true}
        />
      </div>
    </div>
  );
};

export default BaseNutrientsChartTile;
