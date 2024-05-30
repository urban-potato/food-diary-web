import * as yup from "yup";
import { DECIMAL_REGEX } from "../../../global/constants/constants";
export const BREAKFAST_DEFAULT_ID = "7d0b4a4f-aa3f-464c-94b5-6f0a16e4e340";
export const LUNCH_DEFAULT_ID = "78f0b796-31f9-4b37-ad80-8ceed73978b2";
export const DINNER_DEFAULT_ID = "82ed6910-2828-4631-bd09-bfb3a29e27b3";

export const validValues = {
  requiredErrorMessage: "Обязательное поле",
  decimalTypeErrorMessage:
    "Требуется ввести положительное число, содержащее не больше 3-х знаков после запятой (или точки)",

  ingredientWeightValue: {
    max: {
      value: 1000,
      message: (max: number) => `Число должно быть не больше ${max}`,
    },
    error: "Введены некорректные данные",
  },
};

const weightFieldSchema = yup
  .string()
  .required("• Вес: " + validValues.requiredErrorMessage)
  .matches(DECIMAL_REGEX, "• Вес: " + validValues.decimalTypeErrorMessage)
  .test(
    "max",
    "• Вес: " +
      validValues.ingredientWeightValue.max.message(
        validValues.ingredientWeightValue.max.value
      ),
    (value) => {
      const valueWithDot = value.replace(",", ".");
      const valueFloat = parseFloat(valueWithDot);
      if (Number.isNaN(valueFloat)) return false;

      const result = valueFloat <= validValues.ingredientWeightValue.max.value;

      return result;
    }
  )
  .transform((value) => value.replace(",", ".").trim());

export const createValidationSchema = yup.object({
  creationTime: yup
    .string()
    .required("• Время: " + validValues.requiredErrorMessage),
  addFoodList: yup
    .array()
    .of(
      yup.object({
        foodInfo: yup.object({
          label: yup
            .string()
            .required("• Блюдо: " + validValues.requiredErrorMessage),
          value: yup
            .string()
            .required("• Блюдо: " + validValues.requiredErrorMessage),
          isElementary: yup.boolean(),
        }),

        weight: weightFieldSchema,
      })
    )
    .required(),
});

export const editValidationSchema = yup.object({
  addFoodList: yup
    .array()
    .of(
      yup.object({
        foodInfo: yup.object({
          label: yup.string(),
          value: yup
            .string()
            .required("• Блюдо: " + validValues.requiredErrorMessage),
          isElementary: yup.boolean(),
        }),

        weight: weightFieldSchema,
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

        weight: weightFieldSchema,
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

        weight: weightFieldSchema,
      })
    )
    .required(),
});
