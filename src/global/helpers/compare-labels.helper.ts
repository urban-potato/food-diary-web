type TElement = {
  label: string;
  [key: string]: any;
};

export function compareLabels(a: TElement, b: TElement) {
  if (a.label < b.label) {
    return -1;
  }
  if (a.label > b.label) {
    return 1;
  }
  return 0;
}
