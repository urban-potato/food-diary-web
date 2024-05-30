export const replaceIncorrectDecimal = (decimal: string): string => {
  decimal = decimal.replace(/[^0-9\,\.]+/g, "");
  decimal = decimal.replace(/(?<=\,|\.)[^0-9]/g, "");
  decimal = decimal.replace(/^[^0-9]/, "");
  decimal = decimal.replace(/(?<=\d+)(?<=(\,|\.)\d{3}).*/g, "");
  decimal = decimal.replace(/(?<=(\,|\.)\d+)[^0-9]/g, "");

  return decimal;
};
