import * as yup from "yup";

export const validValues = {
  requiredErrorMessage: "• Обязательное поле",
  numberTypeErrorMessage: "• Требуется ввести число",
  numberMustBePositiveErrorMessage: "• Число должно быть положительным",
  foodElementaryName: {
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
  characteristicValue: {
    min: {
      value: 0,
      message: (min: number) => `• Число должно быть больше или равно ${min}`,
    },
    error: "• Введены некорректные данные",
  },
};

export const createFoodElementaryValidationSchema = yup.object().shape({
  foodElementaryName: yup
    .string()
    .min(
      validValues.foodElementaryName.min.value,
      validValues.foodElementaryName.min.message(
        validValues.foodElementaryName.min.value
      )
    )
    .max(
      validValues.foodElementaryName.max.value,
      validValues.foodElementaryName.max.message(
        validValues.foodElementaryName.max.value
      )
    )
    .required(validValues.requiredErrorMessage),
  addCharacteristicsList: yup
    .array()
    .of(
      yup.object({
        characteristicInfo: yup.object({
          label: yup.string(),
          value: yup.string().required(validValues.requiredErrorMessage),
        }),
        // .required("• Ингредиент: " + validValues.requiredErrorMessage),

        characteristicValue: yup
          .number()
          .required(validValues.requiredErrorMessage)
          .typeError(validValues.numberTypeErrorMessage)
          .min(
            validValues.characteristicValue.min.value,
            validValues.characteristicValue.min.message(
              validValues.characteristicValue.min.value
            )
          )
          .integer(),
      })
    )
    .required(),
});

// export const createFoodElementaryValidationSchema = yup.object().shape({
//   name: yup
//     .string()
//     .min(
//       validValues.name.min.value,
//       validValues.name.min.message(validValues.name.min.value)
//     )
//     .max(
//       validValues.name.max.value,
//       validValues.name.max.message(validValues.name.max.value)
//     )
//     .required(validValues.requiredErrorMessage),
//   proteinValue: yup
//     .number()
//     // .required(validValues.requiredErrorMessage)
//     .typeError(validValues.numberTypeErrorMessage)
//     .transform((cv) => (isNaN(cv) ? 0 : cv))
//     .min(
//       validValues.proteinValue.min.value,
//       validValues.proteinValue.min.message(validValues.proteinValue.min.value)
//     )
//     .integer(),
//   fatValue: yup
//     .number()
//     // .required(validValues.requiredErrorMessage)
//     .typeError(validValues.numberTypeErrorMessage)
//     .transform((cv) => (isNaN(cv) ? 0 : cv))
//     .min(
//       validValues.fatValue.min.value,
//       validValues.fatValue.min.message(validValues.fatValue.min.value)
//     )
//     .integer(),
//   carbohydrateValue: yup
//     .number()
//     // .required(validValues.requiredErrorMessage)
//     .typeError(validValues.numberTypeErrorMessage)
//     .transform((cv) => (isNaN(cv) ? 0 : cv))
//     .min(
//       validValues.carbohydrateValue.min.value,
//       validValues.carbohydrateValue.min.message(
//         validValues.carbohydrateValue.min.value
//       )
//     )
//     .integer(),
//   caloriesValue: yup
//     .number()
//     // .required(validValues.requiredErrorMessage)
//     .typeError(validValues.numberTypeErrorMessage)
//     .transform((cv) => (isNaN(cv) ? 0 : cv))
//     .min(
//       validValues.caloriesValue.min.value,
//       validValues.caloriesValue.min.message(validValues.caloriesValue.min.value)
//     )
//     .integer(),
// });
