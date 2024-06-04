import { ChartOptions } from "chart.js";
import { calculatePercentage } from "../helpers/DoughnutChart.helpers";

export const doughnutOptions: ChartOptions<"doughnut"> = {
  plugins: {
    tooltip: {
      callbacks: {
        label: (ctx: any) => {
          return calculatePercentage({
            value: ctx.raw,
            dataArr: ctx.chart.data.datasets[0].data,
          });
        },
      },
    },
    legend: {
      display: true,
      position: "bottom",
      labels: {
        usePointStyle: true,
        pointStyle: "circle",
        color: "#0d0b26",
        font: {
          size: 13,
        },
      },
      align: "center",
    },
    datalabels: {
      formatter: (value, ctx) => {
        return calculatePercentage({
          value: value,
          dataArr: ctx.chart.data.datasets[0].data as number[],
        });
      },
      color: "#0d0b26",
    },
  },
};

export const defaultDoughnutOptions: ChartOptions<"doughnut"> = {
  plugins: {
    ...doughnutOptions.plugins,
    datalabels: {
      display: false,
    },
    tooltip: {
      enabled: false,
    },
  },
};
