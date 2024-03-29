import * as yup from "yup";
import { SubmitHandler, useForm, useFormState } from "react-hook-form";
import { validValues } from "../constants/constants";
import { FC, useEffect } from "react";
import {
  FoodElementaryCreateFormProps,
  FoodElementaryData,
} from "../types/types";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCreateFoodElementaryMutation } from "../api/foodElementary.api";
import InputIlluminated from "../../../ui/InputIlluminated/InputIlluminated.tsx";
import ButtonIlluminated from "../../../ui/ButtonIlluminated/ButtonIlluminated.tsx";

const FoodElementaryCreateForm: FC<FoodElementaryCreateFormProps> = ({
  setShowCreateForm,
}) => {
  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .min(
        validValues.name.min.value,
        validValues.name.min.message(validValues.name.min.value)
      )
      .max(
        validValues.name.max.value,
        validValues.name.max.message(validValues.name.max.value)
      )
      .required(validValues.requiredErrorMessage),
    proteinValue: yup
      .number()
      // .required(validValues.requiredErrorMessage)
      .typeError(validValues.numberTypeErrorMessage)
      .transform((cv) => (isNaN(cv) ? 0 : cv))
      .min(
        validValues.proteinValue.min.value,
        validValues.proteinValue.min.message(validValues.proteinValue.min.value)
      )
      .integer(),
    fatValue: yup
      .number()
      // .required(validValues.requiredErrorMessage)
      .typeError(validValues.numberTypeErrorMessage)
      .transform((cv) => (isNaN(cv) ? 0 : cv))
      .min(
        validValues.fatValue.min.value,
        validValues.fatValue.min.message(validValues.fatValue.min.value)
      )
      .integer(),
    carbohydrateValue: yup
      .number()
      // .required(validValues.requiredErrorMessage)
      .typeError(validValues.numberTypeErrorMessage)
      .transform((cv) => (isNaN(cv) ? 0 : cv))
      .min(
        validValues.carbohydrateValue.min.value,
        validValues.carbohydrateValue.min.message(
          validValues.carbohydrateValue.min.value
        )
      )
      .integer(),
    caloriesValue: yup
      .number()
      // .required(validValues.requiredErrorMessage)
      .typeError(validValues.numberTypeErrorMessage)
      .transform((cv) => (isNaN(cv) ? 0 : cv))
      .min(
        validValues.caloriesValue.min.value,
        validValues.caloriesValue.min.message(
          validValues.caloriesValue.min.value
        )
      )
      .integer(),
  });

  let defaultValues = {
    proteinValue: 0,
    fatValue: 0,
    carbohydrateValue: 0,
    caloriesValue: 0,
  };

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
    getValues,
    control,
    trigger,
  } = useForm<FoodElementaryData>({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
    defaultValues: defaultValues,
  });

  const { dirtyFields, touchedFields } = useFormState({ control });

  const [doCreateFoodElementary, doCreateFoodElementaryResult] =
    useCreateFoodElementaryMutation();

  const onSubmit: SubmitHandler<FoodElementaryData> = async (data) => {
    const { name, proteinValue, fatValue, carbohydrateValue, caloriesValue } =
      data;

    console.log(data);

    const submitData = {
      name: name,
      proteinValue: proteinValue,
      fatValue: fatValue,
      carbohydrateValue: carbohydrateValue,
      caloriesValue: caloriesValue,
    };

    try {
      const result = doCreateFoodElementary(submitData);

      reset();
      setShowCreateForm(false);
    } catch (error: any) {
      console.log("error");
      console.log(error);
      alert(error?.data?.title);
    }
  };

  let isFilledRight =
    getValues("name") &&
    !errors?.name &&
    !errors?.proteinValue &&
    !errors?.fatValue &&
    !errors?.carbohydrateValue &&
    !errors?.caloriesValue
      ? true
      : false;

  useEffect(() => {
    if (Object.keys(dirtyFields).length && !Object.keys(touchedFields).length) {
      trigger();
    }
  }, [dirtyFields, touchedFields]);

  return (
    <section
      className=" 
      flex-grow-100 
      
      w-full 
        
      flex flex-col flex-wrap 
      justify-center items-center

      mb-3

      "
    >
      <h2 className=" mb-3">Создать простое блюдо</h2>

      <div className="group/foodAdd relative w-full max-w-5xl">
        <div
          className="absolute inset-0 
      
      rounded-xl 

      bg-gradient-to-r from-pink-500 to-violet-500 
      opacity-25 

      transition duration-1000 

      group-hover/foodAdd:opacity-40 
      group-hover/foodAdd:duration-500 
      group-hover/foodAdd:scale-101

      group-focus-within/foodAdd:opacity-40 
      group-focus-within/foodAdd:duration-500 
      group-focus-within/foodAdd:scale-101
      
      "
        ></div>
        <form
          className=" flex flex-col flex-wrap justify-center 
          w-full 
          
        relative
        
        transition duration-1000 

        group-hover/foodAdd:duration-500 
        group-hover/foodAdd:scale-101
  
        group-focus-within/foodAdd:duration-500 
        group-focus-within/foodAdd:scale-101

        px-7  pt-5 pb-8
        "
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="text-xl">
            <InputIlluminated
              id="name"
              type="text"
              placeholder="Название блюда"
              register={{ ...register("name") }}
              // errorMessage={errors.name?.message}
              isError={errors.name ? true : false}
              // inset=" inset-0 "
              isRequired={true}
            />
          </div>
          <div className="mt-4 ">
            <div className=" font-semibold mb-1 text-[17px]">
              Нутриенты на 100гр:
            </div>

            <div className="w-full  flex flex-wrap gap-x-4 justify-center items-stretch">
              <div className="flex-grow-100 ">
                <InputIlluminated
                  id="proteinValue"
                  type="number"
                  placeholder="Белки"
                  register={{ ...register("proteinValue") }}
                  // errorMessage={errors.proteinValue?.message}
                  isError={errors.proteinValue ? true : false}
                  // inset=" inset-0 "
                />
              </div>
              <div className="flex-grow-100 ">
                <InputIlluminated
                  id="fatValue"
                  type="number"
                  placeholder="Жиры"
                  register={{ ...register("fatValue") }}
                  // errorMessage={errors.fatValue?.message}
                  isError={errors.fatValue ? true : false}
                  // inset=" inset-0 "
                />
              </div>
              <div className="flex-grow-100 ">
                <InputIlluminated
                  id="carbohydrateValue"
                  type="number"
                  placeholder="Углеводы"
                  register={{ ...register("carbohydrateValue") }}
                  // errorMessage={errors.carbohydrateValue?.message}
                  isError={errors.carbohydrateValue ? true : false}
                  // inset=" inset-0 "
                />
              </div>
              <div className="flex-grow-100 ">
                <InputIlluminated
                  id="caloriesValue"
                  type="number"
                  placeholder="Ккал"
                  register={{ ...register("caloriesValue") }}
                  // errorMessage={errors.caloriesValue?.message}
                  isError={errors.caloriesValue ? true : false}
                  // inset=" inset-0 "
                />
              </div>
            </div>
          </div>

          <div
            className={
              Object.keys(errors).length > 0
                ? "  flex flex-col mt-5 px-5 gap-y-2 justify-center "
                : " hidden "
            }
          >
            <p className={errors.name ? "text-pink-500 " : " hidden "}>
              {errors.name?.message}
            </p>
            <p className={errors.proteinValue ? "text-pink-500 " : " hidden "}>
              {errors.proteinValue?.message}
            </p>
            <p className={errors.fatValue ? "text-pink-500 " : " hidden "}>
              {errors.fatValue?.message}
            </p>
            <p
              className={
                errors.carbohydrateValue ? "text-pink-500 " : " hidden "
              }
            >
              {errors.carbohydrateValue?.message}
            </p>
            <p className={errors.caloriesValue ? "text-pink-500 " : " hidden "}>
              {errors.caloriesValue?.message}
            </p>
          </div>

          {/* <button type="submit" className="btn btn_dark ">
            Сохранить
          </button> */}

          <div className="mt-7">
            <ButtonIlluminated
              label="Сохранить"
              isDarkButton={true}
              isIlluminationFull={false}
              // additionalStyles=" w-[280px] "
              isButton={true}
              type="submit"
              additionalStyles=""
              isDisabled={isFilledRight ? false : true}
            />
          </div>
        </form>
      </div>
    </section>
  );
};

export default FoodElementaryCreateForm;
