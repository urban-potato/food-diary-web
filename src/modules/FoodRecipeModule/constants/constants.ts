import * as yup from "yup";

export const validValues = {
  requiredErrorMessage: "Обязательное поле",
  numberTypeErrorMessage: "Требуется ввести число",
  integerTypeErrorMessage: "Требуется ввести целое число",
  numberMustBePositiveErrorMessage: "Число должно быть положительным",
  foodRecipeName: {
    min: {
      value: 1,
      message: (min: number) =>
        `• Название блюда: Должно составлять от ${min} символа`,
    },
    max: {
      value: 256,
      message: (max: number) =>
        `• Название блюда: Должно составлять до ${max} символов`,
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
    .required("• Название блюда: " + validValues.requiredErrorMessage),
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
          .integer("• Вес: " + validValues.integerTypeErrorMessage),
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
    .required("• Название блюда: " + validValues.requiredErrorMessage),
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
          .integer("• Вес: " + validValues.integerTypeErrorMessage),
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
            .required("• Ингредиент: " + validValues.requiredErrorMessage),
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
          .integer("• Вес: " + validValues.integerTypeErrorMessage),
      })
    )
    .required(),
});
