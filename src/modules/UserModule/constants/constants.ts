export const validValues = {
    requiredErrorMessage: "Обязательное поле",
    email: {
        error: "• Почта: Введены некорректные данные",
      },
    firstName: {
      min: {
        value: 3,
        message: (min: number) => `• Имя: Минимальная длина - ${min} символа`,
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
        value: 80,
        message: (max: number) => `• Фамилия: Максимальная длина - ${max} символов`,
      },
      error: "• Фамилия: Введены некорректные данные",
    },
  };
  