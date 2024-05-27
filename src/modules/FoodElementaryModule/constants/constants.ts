import * as yup from "yup";
import { DECIMAL_REGEX } from "../../../global/constants/constants";

export const validValues = {
  requiredErrorMessage: "Обязательное поле",
  decimalTypeErrorMessage:
    "Требуется ввести положительное число, содержащее не больше 3-х знаков после запятой (или точки)",
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
      value: 20000,
      message: (max: number) => `Число должно быть не больше ${max}`,
    },
  },
  nutrientValue: {
    min: {
      value: 0,
      message: (min: number) => `Число должно быть больше или равно ${min}`,
    },
    max: {
      value: 1000,
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
      DECIMAL_REGEX,
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
    )
    .transform((value) => value.replace(",", ".")),
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
          .string()
          .required("• Вес: " + validValues.requiredErrorMessage)
          .matches(
            DECIMAL_REGEX,
            "• Вес: " + validValues.decimalTypeErrorMessage
          )
          .test(
            "max",
            "• Вес: " +
              validValues.nutrientValue.max.message(
                validValues.nutrientValue.max.value
              ),
            (value) => {
              const valueWithDot = value.replace(",", ".");
              const valueFloat = parseFloat(valueWithDot);
              if (Number.isNaN(valueFloat)) return false;

              const result = valueFloat <= validValues.nutrientValue.max.value;

              return result;
            }
          )
          .transform((value) => value.replace(",", ".")),
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
          .string()
          .required("• Вес: " + validValues.requiredErrorMessage)
          .matches(
            DECIMAL_REGEX,
            "• Вес: " + validValues.decimalTypeErrorMessage
          )
          .test(
            "max",
            "• Вес: " +
              validValues.nutrientValue.max.message(
                validValues.nutrientValue.max.value
              ),
            (value) => {
              const valueWithDot = value.replace(",", ".");
              const valueFloat = parseFloat(valueWithDot);
              if (Number.isNaN(valueFloat)) return false;

              const result = valueFloat <= validValues.nutrientValue.max.value;

              return result;
            }
          )
          .transform((value) => value.replace(",", ".")),
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
    .string()
    .required("• Калорийность: " + validValues.requiredErrorMessage)
    .matches(
      DECIMAL_REGEX,
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
    )
    .transform((value) => value.replace(",", ".")),
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
          .string()
          .required("• Вес: " + validValues.requiredErrorMessage)
          .matches(
            DECIMAL_REGEX,
            "• Вес: " + validValues.decimalTypeErrorMessage
          )
          .test(
            "max",
            "• Вес: " +
              validValues.nutrientValue.max.message(
                validValues.nutrientValue.max.value
              ),
            (value) => {
              const valueWithDot = value.replace(",", ".");
              const valueFloat = parseFloat(valueWithDot);
              if (Number.isNaN(valueFloat)) return false;

              const result = valueFloat <= validValues.nutrientValue.max.value;

              return result;
            }
          )
          .transform((value) => value.replace(",", ".")),
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
          .string()
          .required("• Вес: " + validValues.requiredErrorMessage)
          .matches(
            DECIMAL_REGEX,
            "• Вес: " + validValues.decimalTypeErrorMessage
          )
          .test(
            "max",
            "• Вес: " +
              validValues.nutrientValue.max.message(
                validValues.nutrientValue.max.value
              ),
            (value) => {
              const valueWithDot = value.replace(",", ".");
              const valueFloat = parseFloat(valueWithDot);
              if (Number.isNaN(valueFloat)) return false;

              const result = valueFloat <= validValues.nutrientValue.max.value;

              return result;
            }
          )
          .transform((value) => value.replace(",", ".")),
      })
    )
    .required(),
});
