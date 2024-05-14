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
  caloriesValue: yup
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

export const editFoodElementaryValidationSchema = yup.object().shape({
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
  caloriesValue: yup
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
  originalCharacteristicsList: yup
    .array()
    .of(
      yup.object({
        characteristicInfo: yup.object({
          label: yup.string(),
          value: yup.string().required(validValues.requiredErrorMessage),
          characteristicTypeId: yup.string().required(validValues.requiredErrorMessage),
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
