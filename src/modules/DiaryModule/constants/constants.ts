import { NoticeProps, StylesConfig, components } from "react-select";
import * as yup from "yup";

export const BREAKFAST_DEFAULT_ID = "7d0b4a4f-aa3f-464c-94b5-6f0a16e4e340";
export const LUNCH_DEFAULT_ID = "78f0b796-31f9-4b37-ad80-8ceed73978b2";
export const DINNER_DEFAULT_ID = "82ed6910-2828-4631-bd09-bfb3a29e27b3";

export const validValues = {
  requiredErrorMessage: "Обязательное поле",
  numberTypeErrorMessage: "Требуется ввести число",
  numberMustBePositiveErrorMessage: "Число должно быть положительным",
  weightValue: {
    min: {
      value: 0,
      message: (min: number) =>
        `• Вес: Число должно быть больше или равно ${min}`,
    },
    error: "• Вес: Введены некорректные данные",
  },
};

export const validationSchema = yup.object({
  foodElementaryList: yup
    .array()
    .of(
      yup.object({
        foodElementaryId: yup.object({
          label: yup.string(),
          value: yup
            .string()
            .required("• Блюдо: " + validValues.requiredErrorMessage),
        }),
        // .required("• Блюдо: " + validValues.requiredErrorMessage),

        weight: yup
          .number()
          .required("• Вес: " + validValues.requiredErrorMessage)
          .typeError("• Вес: " + validValues.numberTypeErrorMessage)
          .min(
            validValues.weightValue.min.value,
            validValues.weightValue.min.message(
              validValues.weightValue.min.value
            )
          )
          .integer(),
      })
    )
    .required(),
});

export const editValidationSchema = yup.object({
  foodElementaryList: yup
    .array()
    .of(
      yup.object({
        foodElementaryId: yup.object({
          label: yup.string(),
          value: yup
            .string()
            .required("• Блюдо: " + validValues.requiredErrorMessage),
        }),
        // .required("• Блюдо: " + validValues.requiredErrorMessage),

        weight: yup
          .number()
          .required("• Вес: " + validValues.requiredErrorMessage)
          .typeError("• Вес: " + validValues.numberTypeErrorMessage)
          .min(
            validValues.weightValue.min.value,
            validValues.weightValue.min.message(
              validValues.weightValue.min.value
            )
          )
          .integer(),
      })
    )
    .required(),
  originalFoodElementaryList: yup
    .array()
    .of(
      yup.object({
        foodElementaryId: yup.object({
          label: yup.string(),
          value: yup
            .string()
            .required("• Блюдо: " + validValues.requiredErrorMessage),
        }),
        // .required("• Блюдо: " + validValues.requiredErrorMessage),

        weight: yup
          .number()
          .required("• Вес: " + validValues.requiredErrorMessage)
          .typeError("• Вес: " + validValues.numberTypeErrorMessage)
          .min(
            validValues.weightValue.min.value,
            validValues.weightValue.min.message(
              validValues.weightValue.min.value
            )
          )
          .integer(),
      })
    )
    .required(),
  foodRecipeList: yup
    .array()
    .of(
      yup.object({
        foodRecipeId: yup.object({
          label: yup.string(),
          value: yup
            .string()
            .required("• Блюдо: " + validValues.requiredErrorMessage),
        }),
        // .required("• Блюдо: " + validValues.requiredErrorMessage),

        weight: yup
          .number()
          .required("• Вес: " + validValues.requiredErrorMessage)
          .typeError("• Вес: " + validValues.numberTypeErrorMessage)
          .min(
            validValues.weightValue.min.value,
            validValues.weightValue.min.message(
              validValues.weightValue.min.value
            )
          )
          .integer(),
      })
    )
    .required(),
  originalFoodRecipeList: yup
    .array()
    .of(
      yup.object({
        foodRecipeId: yup.object({
          label: yup.string(),
          value: yup
            .string()
            .required("• Блюдо: " + validValues.requiredErrorMessage),
        }),
        // .required("• Блюдо: " + validValues.requiredErrorMessage),

        weight: yup
          .number()
          .required("• Вес: " + validValues.requiredErrorMessage)
          .typeError("• Вес: " + validValues.numberTypeErrorMessage)
          .min(
            validValues.weightValue.min.value,
            validValues.weightValue.min.message(
              validValues.weightValue.min.value
            )
          )
          .integer(),
      })
    )
    .required(),
});

export const selectStyles: StylesConfig = {
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
