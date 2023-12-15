export const validValues = {
  requiredMessage: "Обязательное поле",
  name: {
    min: {
      value: 3,
      message: (min: number) => `Имя должно составлять от ${min} символов`,
    },
    max: {
      value: 256,
      message: (max: number) => `Имя должно составлять до ${max} символов`,
    },
  },
  email: {
    error: "Введены некорректные данные",
  },
  password: {
    min: {
      value: 6,
      message: (min: number) => `Пароль должен составлять от ${min} символов`,
    },
    max: {
      value: 80,
      message: (max: number) => `Пароль должен составлять до ${max} символов`,
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
  passwordsMustMatchMessage: "Пароли должны совпадать",
};
