import * as yup from "yup";

export const validValues = {
  requiredErrorMessage: "Обязательное поле",
  name: {
    min: {
      value: 3,
      message: (min: number) => `• Имя: Минимальная длина - ${min} символа`,
    },
    max: {
      value: 256,
      message: (max: number) => `• Имя: Максимальная длина - ${max} символов`,
    },
  },
  email: {
    error: "• Почта: Введены некорректные данные",
  },
  password: {
    min: {
      value: 6,
      message: (min: number) => `• Пароль: Минимальная длина - ${min} символов`,
    },
    max: {
      value: 80,
      message: (max: number) =>
        `• Пароль: Максимальная длина - ${max} символов`,
    },
  },
  // passwordConfirmation: {
  //   min: {
  //     value: 6,
  //     message: (min: number) => `Пароль должен составлять от ${min} символов`,
  //   },
  //   max: {
  //     value: 80,
  //     message: (max: number) => `Пароль должен составлять до ${max} символов`,
  //   },
  // },
  passwordsMustMatchMessage: "• Повторите пароль: Пароль не совпадает",
};

export const registrationValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email(validValues.email.error)
    .required(`• Почта: ${validValues.requiredErrorMessage}`)
    .matches(
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      validValues.email.error
    ),
  password: yup
    .string()
    .min(
      validValues.password.min.value,
      validValues.password.min.message(validValues.password.min.value)
    )
    .max(
      validValues.password.max.value,
      validValues.password.max.message(validValues.password.max.value)
    )
    .required(`• Пароль: ${validValues.requiredErrorMessage}`),
  passwordConfirmation: yup
    .string()
    // .min(
    //   validValues.passwordConfirmation.min.value,
    //   validValues.passwordConfirmation.min.message(validValues.passwordConfirmation.min.value)
    // )
    // .max(
    //   validValues.passwordConfirmation.max.value,
    //   validValues.passwordConfirmation.max.message(validValues.passwordConfirmation.max.value)
    // )
    .required(`• Повторите пароль: ${validValues.requiredErrorMessage}`)
    .oneOf([yup.ref("password")], validValues.passwordsMustMatchMessage),
});
