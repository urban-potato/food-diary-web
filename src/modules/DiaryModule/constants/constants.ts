export const BREAKFAST_DEFAULT_ID = "7d0b4a4f-aa3f-464c-94b5-6f0a16e4e340";
export const LUNCH_DEFAULT_ID = "78f0b796-31f9-4b37-ad80-8ceed73978b2";
export const DINNER_DEFAULT_ID = "82ed6910-2828-4631-bd09-bfb3a29e27b3";

export const validValues = {
  requiredErrorMessage: "Обязательное поле",
  numberTypeErrorMessage: "Требуется ввести число",
  numberMustBePositiveErrorMessage: "Число должно быть положительным",
  weightValue: {
    min: {
      value: 0,
      message: (min: number) =>
        `• Вес: Число должно быть больше или равно ${min}`,
    },
    error: "• Вес: Введены некорректные данные",
  },
};
