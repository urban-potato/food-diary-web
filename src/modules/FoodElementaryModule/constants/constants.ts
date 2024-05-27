import * as yup from "yup";

export const validValues = {
  requiredErrorMessage: "Обязательное поле",
  numberTypeErrorMessage: "Требуется ввести число",
  decimalTypeErrorMessage:
    "Требуется ввести положительное число, содержащее не больше 2-х знаков после запятой или точки",
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
  caloriesValue: {
    max: {
      value: 10000,
      message: (max: number) => `Число должно быть не больше ${max}`,
    },
  },
  nutrientValue: {
    min: {
      value: 0,
      message: (min: number) => `Число должно быть больше или равно ${min}`,
    },
    max: {
      value: 100,
      message: (max: number) => `Число должно быть не больше ${max}`,
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
    .string()
    .required("• Калорийность: " + validValues.requiredErrorMessage)
    .matches(
      /^(?:\d+[\,\.]{1}\d{1,2}|\d+)$/,
      "• Калорийность: " + validValues.decimalTypeErrorMessage
    )
    .test(
      "max",
      "• Калорийность: " +
        validValues.caloriesValue.max.message(
          validValues.caloriesValue.max.value
        ),
      (value) => {
        const valueWithDot = value.replace(",", ".");
        const valueFloat = parseFloat(valueWithDot);
        if (Number.isNaN(valueFloat)) return false;

        const result = valueFloat <= validValues.caloriesValue.max.value;

        return result;
      }
    ),
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

        characteristicValue: yup
          .number()
          .required("• Вес: " + validValues.requiredErrorMessage)
          .typeError("• Вес: " + validValues.numberTypeErrorMessage)
          .min(
            validValues.nutrientValue.min.value,
            "• Вес: " +
              validValues.nutrientValue.min.message(
                validValues.nutrientValue.min.value
              )
          ),
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

        characteristicValue: yup
          .number()
          .required("• Вес: " + validValues.requiredErrorMessage)
          .typeError("• Вес: " + validValues.numberTypeErrorMessage)
          .min(
            validValues.nutrientValue.min.value,
            "• Вес: " +
              validValues.nutrientValue.min.message(
                validValues.nutrientValue.min.value
              )
          ),
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
      validValues.nutrientValue.min.value,
      "• Калорийность: " +
        validValues.nutrientValue.min.message(
          validValues.nutrientValue.min.value
        )
    ),
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

        characteristicValue: yup
          .number()
          .required("• Вес: " + validValues.requiredErrorMessage)
          .typeError("• Вес: " + validValues.numberTypeErrorMessage)
          .min(
            validValues.nutrientValue.min.value,
            "• Вес: " +
              validValues.nutrientValue.min.message(
                validValues.nutrientValue.min.value
              )
          ),
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

        characteristicValue: yup
          .number()
          .required("• Вес: " + validValues.requiredErrorMessage)
          .typeError("• Вес: " + validValues.numberTypeErrorMessage)
          .min(
            validValues.nutrientValue.min.value,
            "• Вес: " +
              validValues.nutrientValue.min.message(
                validValues.nutrientValue.min.value
              )
          ),
      })
    )
    .required(),
});
