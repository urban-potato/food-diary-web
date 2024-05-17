import * as yup from "yup";

export const validValues = {
  requiredErrorMessage: "Обязательное поле",
  numberTypeErrorMessage: "Требуется ввести число",
  integerTypeErrorMessage: "Требуется ввести целое число",
  numberMustBePositiveErrorMessage: "Число должно быть положительным",
  foodElementaryName: {
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
  characteristicValue: {
    min: {
      value: 0,
      message: (min: number) => `Число должно быть больше или равно ${min}`,
    },
    error: "Введены некорректные данные",
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
    .required("• Название блюда: " + validValues.requiredErrorMessage),
  caloriesValue: yup
    .number()
    .required("• Калорийность: " + validValues.requiredErrorMessage)
    .typeError("• Калорийность: " + validValues.numberTypeErrorMessage)
    .min(
      validValues.characteristicValue.min.value,
      "• Калорийность: " +
        validValues.characteristicValue.min.message(
          validValues.characteristicValue.min.value
        )
    )
    .integer("• Калорийность: " + validValues.integerTypeErrorMessage),
  addCharacteristicsList: yup
    .array()
    .of(
      yup.object({
        characteristicInfo: yup.object({
          label: yup.string(),
          value: yup
            .string()
            .required("• Нутриент: " + validValues.requiredErrorMessage),
        }),
        // .required("• Ингредиент: " + validValues.requiredErrorMessage),

        characteristicValue: yup
          .number()
          .required("• Вес: " + validValues.requiredErrorMessage)
          .typeError("• Вес: " + validValues.numberTypeErrorMessage)
          .min(
            validValues.characteristicValue.min.value,
            "• Вес: " +
              validValues.characteristicValue.min.message(
                validValues.characteristicValue.min.value
              )
          )
          .integer("• Вес: " + validValues.integerTypeErrorMessage),
      })
    )
    .required(),
  defaultCharacteristicsList: yup
    .array()
    .of(
      yup.object({
        characteristicInfo: yup.object({
          label: yup
            .string()
            .required("• Нутриент: " + validValues.requiredErrorMessage),
          value: yup
            .string()
            .required("• Нутриент: " + validValues.requiredErrorMessage),
        }),
        // .required("• Ингредиент: " + validValues.requiredErrorMessage),

        characteristicValue: yup
          .number()
          .required("• Вес: " + validValues.requiredErrorMessage)
          .typeError("• Вес: " + validValues.numberTypeErrorMessage)
          .min(
            validValues.characteristicValue.min.value,
            "• Вес: " +
              validValues.characteristicValue.min.message(
                validValues.characteristicValue.min.value
              )
          )
          .integer("• Вес: " + validValues.integerTypeErrorMessage),
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
    .required("• Название блюда: " + validValues.requiredErrorMessage),
  caloriesValue: yup
    .number()
    .required("• Калорийность: " + validValues.requiredErrorMessage)
    .typeError("• Калорийность: " + validValues.numberTypeErrorMessage)
    .min(
      validValues.characteristicValue.min.value,
      "• Калорийность: " +
        validValues.characteristicValue.min.message(
          validValues.characteristicValue.min.value
        )
    )
    .integer("• Калорийность: " + validValues.integerTypeErrorMessage),
  addCharacteristicsList: yup
    .array()
    .of(
      yup.object({
        characteristicInfo: yup.object({
          label: yup.string(),
          value: yup
            .string()
            .required("• Нутриент: " + validValues.requiredErrorMessage),
        }),
        // .required("• Ингредиент: " + validValues.requiredErrorMessage),

        characteristicValue: yup
          .number()
          .required("• Вес: " + validValues.requiredErrorMessage)
          .typeError("• Вес: " + validValues.numberTypeErrorMessage)
          .min(
            validValues.characteristicValue.min.value,
            "• Вес: " +
              validValues.characteristicValue.min.message(
                validValues.characteristicValue.min.value
              )
          )
          .integer("• Вес: " + validValues.integerTypeErrorMessage),
      })
    )
    .required(),
  originalCharacteristicsList: yup
    .array()
    .of(
      yup.object({
        characteristicInfo: yup.object({
          label: yup.string(),
          value: yup
            .string()
            .required("• Нутриент: " + validValues.requiredErrorMessage),
          characteristicTypeId: yup
            .string()
            .required("• Нутриент: " + validValues.requiredErrorMessage),
        }),
        // .required("• Ингредиент: " + validValues.requiredErrorMessage),

        characteristicValue: yup
          .number()
          .required("• Вес: " + validValues.requiredErrorMessage)
          .typeError("• Вес: " + validValues.numberTypeErrorMessage)
          .min(
            validValues.characteristicValue.min.value,
            "• Вес: " +
              validValues.characteristicValue.min.message(
                validValues.characteristicValue.min.value
              )
          )
          .integer("• Вес: " + validValues.integerTypeErrorMessage),
      })
    )
    .required(),
});
