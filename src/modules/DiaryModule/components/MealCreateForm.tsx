import * as yup from "yup";
import { FC, useRef, useState } from "react";
import { MealCreateFormProps, MealData } from "../types/types";
import {
  BREAKFAST_DEFAULT_ID,
  DINNER_DEFAULT_ID,
  LUNCH_DEFAULT_ID,
  validValues,
} from "../constants/constants";
import {
  Controller,
  useFieldArray,
  useForm,
  useFormState,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ButtonIlluminated from "../../../ui/ButtonIlluminated/ButtonIlluminated";
import { useGetAllFoodElementaryQuery } from "../../FoodElementaryModule";
import AsyncSelect from "react-select/async";
import InputIlluminated from "../../../ui/InputIlluminated/InputIlluminated";
import React from "react";
import {
  useChangeCourseMealAddFoodElementaryMutation,
  useCreateCourseMealDayMutation,
  useLazyGetCourseMealDayQuery,
} from "../api/meals.api";
import { components } from "react-select";
import { Player } from "@lordicon/react";

import DELETE_ICON from "../../../global/assets/system-regular-39-trash.json";

const MealCreateForm: FC<MealCreateFormProps> = () => {
  const [selectedMealType, setSelectedMealType] =
    useState(BREAKFAST_DEFAULT_ID);

  const {
    isLoading: isLoadingGetAllFoodElementary,
    data: dataGetAllFoodElementary,
    error: errorGetAllFoodElementary,
  } = useGetAllFoodElementaryQuery(undefined);

  const loadOptions = (searchValue, callback) => {
    const filteredData = dataGetAllFoodElementary.items.filter((item) =>
      item.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    const filteredOptions = filteredData.map((item) => {
      return { value: item.id, label: item.name };
    });

    callback(filteredOptions);
  };

  //   const handleOptionChange = (selectedOption) => {
  //     // console.log("selectedOption", selectedOption);
  //     // setSelectedMeal(selectedOption);
  //     selectedMeal.current = selectedOption.value;
  //     // console.log("selectedMeal", selectedMeal);
  //   };

  const validationSchema = yup.object().shape({
    weight: yup
      .number()
      .required(validValues.requiredErrorMessage)
      .typeError(validValues.numberTypeErrorMessage)
      .min(
        validValues.weightValue.min.value,
        validValues.weightValue.min.message(validValues.weightValue.min.value)
      )
      .integer(),
    foodElementaryId: yup.string().required(validValues.requiredErrorMessage),
  });

  let defaultValues = {
    foodElementaryList: [
      {
        weight: 0,
      },
    ],
  };

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
    getValues,
    control,
    trigger,
  } = useForm<MealData>({
    // resolver: yupResolver(validationSchema),
    mode: "onChange",
    defaultValues: defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    name: "foodElementaryList",
    control,
  });

  //   const { dirtyFields, touchedFields } = useFormState({ control });

  let isFilledRight = true;

  const [doCreateCourseMealDay, doCreateCourseMealDayResult] =
    useCreateCourseMealDayMutation();
  const [doLazyGetCourseMealDay, doLazyGetCourseMealDayResult] =
    useLazyGetCourseMealDayQuery();
  const [doAddFoodElementary, doAddFoodElementaryResult] =
    useChangeCourseMealAddFoodElementaryMutation();

  const onSubmit = async (data) => {
    console.log("data", data);

    const formatNumber = (number: number) => {
      let numberStr = "";

      if (number < 10) {
        numberStr = "0" + number;
      } else {
        numberStr = number.toString();
      }

      return numberStr;
    };

    const nowDate = new Date();

    let month = formatNumber(nowDate.getMonth());
    let day = formatNumber(nowDate.getDate());
    let hours = formatNumber(nowDate.getHours());
    let minutes = formatNumber(nowDate.getMinutes());
    let seconds = formatNumber(nowDate.getSeconds());

    const date = `${nowDate.getFullYear()}-${month}-${day}`;
    const time = `${hours}:${minutes}:${seconds}`;
    const mealType = selectedMealType;
    const foodElementaryList = data.foodElementaryList.map((item) => {
      return {
        foodElementaryId: item.foodElementaryId.value,
        weight: item.weight,
      };
    });

    const dataForSubmit = {
      date,
      time,
      mealType,
      foodElementaryList,
    };

    console.log("dataForSubmit", dataForSubmit);

    const courseMealDayData = {
      courseMealDate: date,
    };

    await doCreateCourseMealDay(courseMealDayData)
      .unwrap()
      .then((courseMealDayId) => {
        doLazyGetCourseMealDay(courseMealDayId)
          .unwrap()
          .then((courseMealDayData) => {
            const courseMealId = courseMealDayData.courseMeals.find(
              (meal) => meal.mealTypeId == mealType
            ).id;

            for (const foodElementary of foodElementaryList) {
              const foolElementaryData = {
                foodElementaryId: foodElementary.foodElementaryId,
                weight: foodElementary.weight,
              };

              const addFoodElementaryData = {
                id: courseMealId,
                data: foolElementaryData,
              };

              doAddFoodElementary(addFoodElementaryData).catch((e) =>
                console.log(e)
              );
            }
          })
          .catch((e) => console.log(e));
      })
      .catch((e) => console.log(e));

    reset();
  };

  const NoOptionsMessage = (props) => {
    return (
      <components.NoOptionsMessage {...props}>
        <span className="custom-css-class">Ничего не нашлось</span>
      </components.NoOptionsMessage>
    );
  };

  const selectStyles = {
    control: (styles) => ({
      ...styles,
      backgroundColor: "white",
      borderRadius: "12px",
      border: 0,
      boxShadow: "none",
    }),
    noOptionsMessage: (base) => ({
      ...base,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#C2BAFF" : "white",
    }),
  };

  const deleteIconPlayerRef = useRef<Player>(null);
  const ICON_SIZE = 28;

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
      <h2 className=" mt-4 mb-3">Новая запись</h2>

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
          <div
            className=" h-full w-full 
                  flex flex-wrap
                  justify-center items-center 
                  py-3 gap-x-5 gap-y-2 "
          >
            <span className=" w-full max-w-[280px] ">
              <ButtonIlluminated
                label={"Завтрак"}
                isDarkButton={
                  selectedMealType == BREAKFAST_DEFAULT_ID ? true : false
                }
                isIlluminationFull={
                  selectedMealType == BREAKFAST_DEFAULT_ID ? true : false
                }
                onClick={() => setSelectedMealType(BREAKFAST_DEFAULT_ID)}
                buttonPadding=" p-[14px] "
              />
            </span>
            <span className=" w-full max-w-[280px] ">
              <ButtonIlluminated
                label={"Обед"}
                isDarkButton={
                  selectedMealType == LUNCH_DEFAULT_ID ? true : false
                }
                isIlluminationFull={
                  selectedMealType == LUNCH_DEFAULT_ID ? true : false
                }
                onClick={() => setSelectedMealType(LUNCH_DEFAULT_ID)}
                buttonPadding=" p-[14px] "
              />
            </span>
            <span className=" w-full max-w-[280px] ">
              <ButtonIlluminated
                label={"Ужин"}
                isDarkButton={
                  selectedMealType == DINNER_DEFAULT_ID ? true : false
                }
                isIlluminationFull={
                  selectedMealType == DINNER_DEFAULT_ID ? true : false
                }
                onClick={() => setSelectedMealType(DINNER_DEFAULT_ID)}
                buttonPadding=" p-[14px] "
              />
            </span>
          </div>

          <div className=" flex flex-col">
            <h3 className="text-xl my-3 ">Блюда:</h3>

            {fields.map((field, index) => {
              return (
                <div key={field.id} className="form-control gap-x-3 flex  mb-1">
                  <div className="flex flex-col justify-center gap-3 flex-grow  mb-3 ">
                    <span className="flex gap-x-1  ">
                      <h3>Блюдо</h3>
                      <p className="text-red">*</p>
                    </span>
                    <Controller
                      key={index}
                      name={
                        `foodElementaryList.${index}.foodElementaryId` as const
                      }
                      control={control}
                      render={({ field }) => (
                        <div className=" relative group/inputMeal ">
                          <div
                            className="absolute 
                        bg-gradient-to-r from-purple-500 to-purple-500 
                        rounded-xl 
                        blur-sm 
                        opacity-40 
                        group-hover/inputMeal:opacity-70 group-focus/inputMeal:opacity-70 
                        transition duration-1000 group-hover/inputMeal:duration-500 "
                          ></div>
                          <AsyncSelect
                            key={index}
                            className="relative text-sm rounded-xl  "
                            components={{ NoOptionsMessage }}
                            styles={selectStyles}
                            placeholder="Введите название блюда"
                            loadOptions={loadOptions}
                            {...field}
                            required={true}
                          />
                        </div>
                      )}
                    />
                  </div>

                  <div className=" -mt-4 sm:max-w-[100px] max-w-[80px] flex-grow">
                    <InputIlluminated
                      id="weight"
                      type="number"
                      placeholder="Вес (г)"
                      disableIllumination={true}
                      additionalStyles=" h-[67px] border-0 "
                      register={{
                        ...register(
                          `foodElementaryList.${index}.weight` as const,
                          { required: true }
                        ),
                      }}
                      // isError={
                      //   errors[`foodElementaryList.${index}.weight`]
                      //     ? true
                      //     : false
                      // }
                      isRequired={true}
                    />
                  </div>

                  {index > 0 && (
                    <div className=" max-w-[60px] flex flex-col justify-center items-center ">
                      <h3 className="text-lg my-3 "> </h3>
                      <ButtonIlluminated
                        label={
                          <span>
                            <Player
                              ref={deleteIconPlayerRef}
                              icon={DELETE_ICON}
                              size={ICON_SIZE}
                              colorize="#f8f7f4"
                            />
                          </span>
                        }
                        isDarkButton={true}
                        isIlluminationFull={false}
                        onClick={() => {
                          remove(index);
                        }}
                        buttonPadding=" p-[14px] "
                        additionalStyles=" "
                      />
                    </div>
                  )}
                </div>
              );
            })}

            <div className=" w-full max-w-[280px] ">
              <ButtonIlluminated
                label={"Еще одно блюдо"}
                isDarkButton={true}
                isIlluminationFull={false}
                onClick={() =>
                  append({
                    foodElementaryId: "",
                    weight: 0,
                  })
                }
                buttonPadding=" p-[14px] "
                additionalStyles=""
              />
            </div>
          </div>

          <div className="mt-9 ">
            <ButtonIlluminated
              label="Сохранить"
              isDarkButton={true}
              isIlluminationFull={false}
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

export default MealCreateForm;
