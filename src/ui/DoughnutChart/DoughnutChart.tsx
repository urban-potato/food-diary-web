import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { FC } from "react";
import {
  defaultDoughnutOptions,
  doughnutOptions,
} from "./constants/DoughnutChart.constants";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

type TProps = {
  labelsList: string[];
  dataList: number[];
  showDefault: boolean;
};

const DoughnutChart: FC<TProps> = ({ labelsList, dataList, showDefault }) => {
  const resultData = {
    labels: labelsList,
    datasets: [
      {
        label: "%",
        data: dataList,
        backgroundColor: [
          "rgba(72, 172, 255, 0.6)",
          "rgba(130, 80, 255, 0.6)",
          "rgba(77, 255, 59, 0.6)",
          "rgba(255, 172, 59, 0.6)",
        ],

        borderWidth: 0,
      },
    ],
  };

  return (
    <Doughnut
      data={resultData}
      //   plugins={[ChartDataLabels]}
      options={showDefault ? defaultDoughnutOptions : doughnutOptions}
    />
  );
};

export default DoughnutChart;
