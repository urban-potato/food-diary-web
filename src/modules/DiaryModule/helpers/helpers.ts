export const formatNumber = (number: number) => {
  let numberStr = "";

  if (number < 10) {
    numberStr = "0" + number;
  } else {
    numberStr = number.toString();
  }

  return numberStr;
};

export const getFormattedDateTime = () => {
  const nowDate = new Date();

  let month = formatNumber(nowDate.getMonth() + 1);
  let day = formatNumber(nowDate.getDate());

  let hours = formatNumber(nowDate.getHours());
  let minutes = formatNumber(nowDate.getMinutes());
  let seconds = formatNumber(nowDate.getSeconds());

  const time = `${hours}:${minutes}:${seconds}`;
  const date = `${nowDate.getFullYear()}-${month}-${day}`;

  const result = [date, time];

  return result;
};
