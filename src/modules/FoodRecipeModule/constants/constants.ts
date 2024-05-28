import * as yup from "yup";
import { DECIMAL_REGEX } from "../../../global/constants/constants";

export const validValues = {
  requiredErrorMessage: "Обязательное поле",
  decimalTypeErrorMessage:
    "Требуется ввести положительное число, содержащее не больше 3-х знаков после запятой (или точки)",

  foodRecipeName: {
    min: {
      value: 1,
      message: (min: number) =>
        `• Название блюда: Минимальная длина - ${min} символ`,
    },
    max: {
      value: 256,
      message: (max: number) =>
        `• Название блюда: Максимальная длина - ${max} символов`,
    },
  },
  ingredientWeightValue: {
    max: {
      value: 1000,
      message: (max: number) => `Число должно быть не больше ${max}`,
    },
    error: "Введены некорректные данные",
  },
};

const foodNameSchema = yup
  .string()
  .min(
    validValues.foodRecipeName.min.value,
    validValues.foodRecipeName.min.message(validValues.foodRecipeName.min.value)
  )
  .max(
    validValues.foodRecipeName.max.value,
    validValues.foodRecipeName.max.message(validValues.foodRecipeName.max.value)
  )
  .required("• Название блюда: " + validValues.requiredErrorMessage)
  .transform((value) => value.trim());

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

const ingredientsListSchema = yup
  .array()
  .of(
    yup.object({
      ingredientInfo: yup.object({
        label: yup.string(),
        value: yup
          .string()
          .required("• Ингредиент: " + validValues.requiredErrorMessage),
      }),

      weight: weightFieldSchema,
    })
  )
  .required();

export const createFoodRecipeValidationSchema = yup.object({
  foodRecipeName: foodNameSchema,
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

        weight: weightFieldSchema,
      })
    )
    .required(),
});

export const editFoodRecipeValidationSchema = yup.object({
  foodRecipeName: foodNameSchema,
  addIngredientsList: ingredientsListSchema,
  originalIngredientsList: ingredientsListSchema,
});
