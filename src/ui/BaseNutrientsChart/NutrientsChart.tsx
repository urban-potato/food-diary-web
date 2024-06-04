import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { FC } from "react";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const doughnutOptions: ChartOptions<"doughnut"> = {
  plugins: {
    tooltip: {
      enabled: false,
    },
    legend: {
      display: true,
      //   responsive: true,
      position: "bottom",
      labels: {
        boxWidth: 10,
        // padding: 40,
        font: {
          size: 13,
        },
        color: "#0d0b26",
      },
      align: "center",
    },
    datalabels: {
      formatter: (value, ctx) => {
        let sum = 0;
        let dataArr: number[] = ctx.chart.data.datasets[0].data;

        dataArr.map((item) => {
          sum += item;
        });

        let percentage = ((value * 100) / sum).toFixed(2) + "%";

        return percentage;
      },
      color: "#0d0b26",
    },
  },
};

type TProps = {
  labelsList: string[];
  dataList: number[];
  showDefault?: boolean;
};

const NutrientsChart: FC<TProps> = ({
  labelsList,
  dataList,
  showDefault = false,
}) => {
  const defaultDoughnutOptions: ChartOptions<"doughnut"> = {
    plugins: {
      ...doughnutOptions.plugins,
      datalabels: {
        display: false,
      },
    },
  };

  const resultData = {
    labels: showDefault ? ["Белки", "Жиры", "Углеводы"] : labelsList,
    datasets: [
      {
        data: showDefault ? [30, 20, 50] : dataList,
        backgroundColor: [
          "rgba(255, 99, 132, 0.8)",
          "rgba(54, 162, 235, 0.8)",
          "rgba(255, 206, 86, 0.8)",
          "rgba(75, 192, 192, 0.8)",
        ],
        borderWidth: 0,
      },
    ],
  };

  console.log("dataList", dataList);

  return (
    <Doughnut
      data={resultData}
      //   plugins={[ChartDataLabels]}
      options={showDefault ? defaultDoughnutOptions : doughnutOptions}
    />
  );
};

export default NutrientsChart;
