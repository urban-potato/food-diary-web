import * as yup from "yup";

export const validValues = {
  requiredErrorMessage: "Обязательное поле",
  basicErrorMessage: "Введены некорректные данные",
  email: {
    error: "• Почта: Введены некорректные данные",
  },
  firstName: {
    min: {
      value: 1,
      message: (min: number) => `• Имя: Минимальная длина - ${min} символ`,
    },
    max: {
      value: 256,
      message: (max: number) => `• Имя: Максимальная длина - ${max} символов`,
    },
    error: "• Имя: Введены некорректные данные",
  },
  lastName: {
    min: {
      value: 1,
      message: (min: number) => `• Фамилия: Минимальная длина - ${min} символ`,
    },
    max: {
      value: 256,
      message: (max: number) =>
        `• Фамилия: Максимальная длина - ${max} символов`,
    },
    error: "• Фамилия: Введены некорректные данные",
  },
  foodCharacteristicTypeName: {
    min: {
      value: 1,
      message: (min: number) => `• Нутриент: Минимальная длина - ${min} символ`,
    },
    max: {
      value: 256,
      message: (max: number) =>
        `• Нутриент: Максимальная длина - ${max} символов`,
    },
    error: "• Нутриент: Введены некорректные данные",
  },
};

export const editFoodCharacteristicTypesValidationSchema = yup.object({
  addFoodCharacteristicTypesList: yup
    .array()
    .of(
      yup.object({
        foodCharacteristicTypeName: yup
          .string()
          .min(
            validValues.foodCharacteristicTypeName.min.value,
            validValues.foodCharacteristicTypeName.min.message(
              validValues.foodCharacteristicTypeName.min.value
            )
          )
          .max(
            validValues.foodCharacteristicTypeName.max.value,
            validValues.foodCharacteristicTypeName.max.message(
              validValues.foodCharacteristicTypeName.max.value
            )
          )
          .required("• Нутриент: " + validValues.requiredErrorMessage)
          .transform((value) => value.trim()),
      })
    )
    .required(),
  originalFoodCharacteristicTypesList: yup
    .array()
    .of(
      yup.object({
        foodCharacteristicType: yup.object({
          id: yup
            .string()
            .required("• Нутриент: " + validValues.requiredErrorMessage),
          name: yup
            .string()
            .min(
              validValues.foodCharacteristicTypeName.min.value,
              validValues.foodCharacteristicTypeName.min.message(
                validValues.foodCharacteristicTypeName.min.value
              )
            )
            .max(
              validValues.foodCharacteristicTypeName.max.value,
              validValues.foodCharacteristicTypeName.max.message(
                validValues.foodCharacteristicTypeName.max.value
              )
            )
            .required("• Нутриент: " + validValues.requiredErrorMessage)
            .transform((value) => value.trim()),
        }),
      })
    )
    .required(),
});
