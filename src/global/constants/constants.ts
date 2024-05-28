import { StylesConfig } from "react-select";
export const PROTEIN_DEFAULT_ID = "0141a646-e0ce-4f7a-9433-97112f05db0f";
export const FAT_DEFAULT_ID = "d126d15b-853a-4b7e-b122-af811a160609";
export const CARBOHYDRATE_DEFAULT_ID = "e3c6d689-4f63-44ff-8844-5bd11e4ed5af";
export const CALORIES_DEFAULT_ID = "cdcc58c7-5c5f-454a-9728-0643afccf491";

export const DECIMAL_REGEX = /^(?:\d+[\,\.]{1}\d{1,3}|\d+)$/;

export const BASIC_CHARACTERISTICS_IDS_LIST = [
  PROTEIN_DEFAULT_ID,
  FAT_DEFAULT_ID,
  CARBOHYDRATE_DEFAULT_ID,
  CALORIES_DEFAULT_ID,
];

export const SELECT_STYLES: StylesConfig = {
  control: (styles) => ({
    ...styles,
    backgroundColor: "white",
    borderRadius: "12px",
    border: 0,
    boxShadow: "none",
  }),
  noOptionsMessage: (base) => ({
    ...base,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected ? "#C2BAFF" : "white",
  }),
};

export const SELECT_STYLES_SMALLER_HEIGHT: StylesConfig = {
  ...SELECT_STYLES,
  control: (base) => ({
    ...base,
    backgroundColor: "white",
    borderRadius: "12px",
    border: 0,
    boxShadow: "none",
    height: 56,
    minHeight: 56,
  }),
};
