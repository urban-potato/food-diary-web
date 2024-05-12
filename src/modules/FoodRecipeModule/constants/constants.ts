import { StylesConfig } from "react-select";
import * as yup from "yup";

export const validValues = {
  requiredErrorMessage: "Обязательное поле",
  numberTypeErrorMessage: "Требуется ввести число",
  numberMustBePositiveErrorMessage: "Число должно быть положительным",
  foodRecipeName: {
    min: {
      value: 1,
      message: (min: number) =>
        `• Название блюда должно составлять от ${min} символа`,
    },
    max: {
      value: 256,
      message: (max: number) =>
        `• Название блюда должно составлять до ${max} символов`,
    },
  },
  weightValue: {
    min: {
      value: 0,
      message: (min: number) =>
        `• Вес: Число должно быть больше или равно ${min}`,
    },
    error: "• Вес: Введены некорректные данные",
  },
};

export const createFoodRecipeValidationSchema = yup.object({
  foodRecipeName: yup
    .string()
    .min(
      validValues.foodRecipeName.min.value,
      validValues.foodRecipeName.min.message(
        validValues.foodRecipeName.min.value
      )
    )
    .max(
      validValues.foodRecipeName.max.value,
      validValues.foodRecipeName.max.message(
        validValues.foodRecipeName.max.value
      )
    )
    .required(validValues.requiredErrorMessage),
  addFoodList: yup
    .array()
    .of(
      yup.object({
        foodInfo: yup.object({
          label: yup.string(),
          value: yup
            .string()
            .required("• Ингредиент: " + validValues.requiredErrorMessage),
        }),
        // .required("• Ингредиент: " + validValues.requiredErrorMessage),

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

export const editFoodRecipeValidationSchema = yup.object({
  foodRecipeName: yup
    .string()
    .min(
      validValues.foodRecipeName.min.value,
      validValues.foodRecipeName.min.message(
        validValues.foodRecipeName.min.value
      )
    )
    .max(
      validValues.foodRecipeName.max.value,
      validValues.foodRecipeName.max.message(
        validValues.foodRecipeName.max.value
      )
    )
    .required(validValues.requiredErrorMessage),
  addIngredientsList: yup
    .array()
    .of(
      yup.object({
        ingredientInfo: yup.object({
          label: yup.string(),
          value: yup
            .string()
            .required("• Ингредиент: " + validValues.requiredErrorMessage),
        }),
        // .required("• Ингредиент: " + validValues.requiredErrorMessage),

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
  originalIngredientsList: yup
    .array()
    .of(
      yup.object({
        ingredientInfo: yup.object({
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
