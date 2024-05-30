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

export const editUserProfileInfoValidationSchema = yup.object({
  email: yup
    .string()
    .email(validValues.email.error)
    .required(`• Почта: ${validValues.requiredErrorMessage}`)
    .matches(
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      validValues.email.error
    )
    .transform((value) => value.trim()),
  firstName: yup
    .string()
    .min(
      validValues.firstName.min.value,
      validValues.firstName.min.message(validValues.firstName.min.value)
    )
    .max(
      validValues.firstName.max.value,
      validValues.firstName.max.message(validValues.firstName.max.value)
    )
    .required(`• Имя: ${validValues.requiredErrorMessage}`)
    .transform((value) => value.trim()),
  lastName: yup
    .string()
    .min(
      validValues.lastName.min.value,
      validValues.lastName.min.message(validValues.lastName.min.value)
    )
    .max(
      validValues.lastName.max.value,
      validValues.lastName.max.message(validValues.lastName.max.value)
    )
    .required(`• Фамилия: ${validValues.requiredErrorMessage}`)
    .transform((value) => value.trim()),
});
