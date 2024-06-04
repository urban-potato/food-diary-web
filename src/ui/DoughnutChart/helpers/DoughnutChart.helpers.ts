export function calculatePercentage({
  value,
  dataArr,
}: {
  value: number;
  dataArr: number[];
}) {
  let sum = 0;

  dataArr.map((item) => {
    sum += item;
  });

  let percentage = ((value * 100) / sum).toFixed(2) + "%";

  return percentage;
}
