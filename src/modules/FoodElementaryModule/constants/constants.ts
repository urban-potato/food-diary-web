export const PROTEIN_DEFAULT_ID = "0141a646-e0ce-4f7a-9433-97112f05db0f";
export const FAT_DEFAULT_ID = "d126d15b-853a-4b7e-b122-af811a160609";
export const CARBOHYDRATE_DEFAULT_ID = "e3c6d689-4f63-44ff-8844-5bd11e4ed5af";
export const CALORIES_DEFAULT_ID = "cdcc58c7-5c5f-454a-9728-0643afccf491";

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
