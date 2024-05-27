export const replaceIncorrectDecimalInput = (text: string): string => {
  text = text.replace(/[^0-9\,\.]+/g, "");
  text = text.replace(/(?<=\,|\.)[^0-9]/g, "");
  text = text.replace(/^[^0-9]/, "");
  text = text.replace(/(?<=\d+)(?<=(\,|\.)\d{3}).*/g, "");
  text = text.replace(/(?<=(\,|\.)\d+)[^0-9]/g, "");

  return text;
};
