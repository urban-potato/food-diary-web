export const validValues = {
  requiredErrorMessage: "Обязательное поле",
  numberTypeErrorMessage: "Требуется ввести число",
  numberMustBePositiveErrorMessage: "Число должно быть положительным",
  name: {
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
  foodCharacteristic: {
    min: {
      value: 0,
      message: (min: number) => `Число должно быть больше или равно ${min}`,
    },
    error: "Введены некорректные данные",
  },
  proteinValue: {
    min: {
      value: 0,
      message: (min: number) =>
        `• Белки: Число должно быть больше или равно ${min}`,
    },
    error: "• Белки: Введены некорректные данные",
  },
  fatValue: {
    min: {
      value: 0,
      message: (min: number) =>
        `• Жиры: Число должно быть больше или равно ${min}`,
    },
    error: "• Жиры: Введены некорректные данные",
  },
  carbohydrateValue: {
    min: {
      value: 0,
      message: (min: number) =>
        `• Углеводы: Число должно быть больше или равно ${min}`,
    },
    error: "• Углеводы: Введены некорректные данные",
  },
  caloriesValue: {
    min: {
      value: 0,
      message: (min: number) =>
        `• Ккал: Число должно быть больше или равно ${min}`,
    },
    error: "• Ккал: Введены некорректные данные",
  },
};
