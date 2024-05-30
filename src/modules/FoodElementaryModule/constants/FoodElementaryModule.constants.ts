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
        `• Название блюда: Минимальная длина - ${min} символ`,
    },
    max: {
      value: 256,
      message: (max: number) =>
        `• Название блюда: Максимальная длина - ${max} символов`,
    },
  },
  caloriesValue: {
    max: {
      value: 20000,
      message: (max: number) => `Число должно быть не больше ${max}`,
    },
  },
  nutrientWeightValue: {
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
    .required("• Название блюда: " + validValues.requiredErrorMessage)
    .transform((value) => value.trim()),
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
    .transform((value) => value.replace(",", ".").trim()),
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
              validValues.nutrientWeightValue.max.message(
                validValues.nutrientWeightValue.max.value
              ),
            (value) => {
              const valueWithDot = value.replace(",", ".");
              const valueFloat = parseFloat(valueWithDot);
              if (Number.isNaN(valueFloat)) return false;

              const result =
                valueFloat <= validValues.nutrientWeightValue.max.value;

              return result;
            }
          )
          .transform((value) => value.replace(",", ".").trim()),
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
              validValues.nutrientWeightValue.max.message(
                validValues.nutrientWeightValue.max.value
              ),
            (value) => {
              const valueWithDot = value.replace(",", ".");
              const valueFloat = parseFloat(valueWithDot);
              if (Number.isNaN(valueFloat)) return false;

              const result =
                valueFloat <= validValues.nutrientWeightValue.max.value;

              return result;
            }
          )
          .transform((value) => value.replace(",", ".").trim()),
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
    .required("• Название блюда: " + validValues.requiredErrorMessage)
    .transform((value) => value.trim()),
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
    .transform((value) => value.replace(",", ".").trim()),
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
              validValues.nutrientWeightValue.max.message(
                validValues.nutrientWeightValue.max.value
              ),
            (value) => {
              const valueWithDot = value.replace(",", ".");
              const valueFloat = parseFloat(valueWithDot);
              if (Number.isNaN(valueFloat)) return false;

              const result =
                valueFloat <= validValues.nutrientWeightValue.max.value;

              return result;
            }
          )
          .transform((value) => value.replace(",", ".").trim()),
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
              validValues.nutrientWeightValue.max.message(
                validValues.nutrientWeightValue.max.value
              ),
            (value) => {
              const valueWithDot = value.replace(",", ".");
              const valueFloat = parseFloat(valueWithDot);
              if (Number.isNaN(valueFloat)) return false;

              const result =
                valueFloat <= validValues.nutrientWeightValue.max.value;

              return result;
            }
          )
          .transform((value) => value.replace(",", ".").trim()),
      })
    )
    .required(),
});
