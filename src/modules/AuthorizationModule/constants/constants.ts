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
      message: (max: number) => `• Пароль: Максимальная длина - ${max} символов`,
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
