import * as yup from "yup";
import { FC, useEffect, useRef, useState } from "react";
import {
  ICourseMeal,
  ICourseMealDay,
  MealCreateFormProps,
  MealData,
} from "../types/types";
import {
  BREAKFAST_DEFAULT_ID,
  DINNER_DEFAULT_ID,
  LUNCH_DEFAULT_ID,
  validValues,
} from "../constants/constants";
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
  useFormState,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ButtonIlluminated from "../../../ui/ButtonIlluminated/ButtonIlluminated";
import { useGetAllFoodElementaryQuery } from "../../FoodElementaryModule";
import type { IFoodElementaryItem } from "../../FoodElementaryModule";
import AsyncSelect from "react-select/async";
import InputIlluminated from "../../../ui/InputIlluminated/InputIlluminated";
import React from "react";
import {
  useChangeCourseMealAddFoodElementaryMutation,
  useCreateCourseMealDayMutation,
  useLazyGetCourseMealDayByDateQuery,
  useLazyGetCourseMealDayQuery,
} from "../api/meals.api";
import { NoticeProps, StylesConfig, components } from "react-select";
import { Player } from "@lordicon/react";

import DELETE_ICON from "../../../global/assets/system-regular-39-trash.json";
import MealTypeOptions from "./MealTypeOptions";

const MealCreateForm: FC<MealCreateFormProps> = () => {
  const deleteIconPlayerRef = useRef<Player>(null);
  const ICON_SIZE = 28;

  const [selectedMealType, setSelectedMealType] =
    useState(BREAKFAST_DEFAULT_ID);

  const [doCreateCourseMealDay, doCreateCourseMealDayResult] =
    useCreateCourseMealDayMutation();
  const [doLazyGetCourseMealDay, doLazyGetCourseMealDayResult] =
    useLazyGetCourseMealDayQuery();
  const [doAddFoodElementary, doAddFoodElementaryResult] =
    useChangeCourseMealAddFoodElementaryMutation();
  const [doLazyGetCourseMealDayByDate, doLazyGetCourseMealDayByDateResult] =
    useLazyGetCourseMealDayByDateQuery();

  const {
    isLoading: isLoadingGetAllFoodElementary,
    data: dataGetAllFoodElementary,
    error: errorGetAllFoodElementary,
  } = useGetAllFoodElementaryQuery(undefined);

  const loadOptions = (searchValue: string, callback: any) => {
    const filteredData: IFoodElementaryItem[] =
      dataGetAllFoodElementary?.items.filter((item: IFoodElementaryItem) =>
        item.name.toLowerCase().includes(searchValue.toLowerCase())
      );

    const filteredOptions = filteredData.map((item) => {
      return { value: item.id, label: item.name };
    });

    callback(filteredOptions);
  };

  const validationSchema = yup.object({
    foodElementaryList: yup
      .array()
      .of(
        yup.object({
          foodElementaryId: yup.object({
            label: yup.string(),
            value: yup
              .string()
              .required("• Блюдо: " + validValues.requiredErrorMessage),
          }),
          // .required("• Блюдо: " + validValues.requiredErrorMessage),

          weight: yup
            .number()
            .required("• Вес: " + validValues.requiredErrorMessage)
            .typeError("• Вес: " + validValues.numberTypeErrorMessage)
            .min(
              validValues.weightValue.min.value,
              validValues.weightValue.min.message(
                validValues.weightValue.min.value
              )
            )
            .integer(),
        })
      )
      .required(),
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
    resolver: yupResolver(validationSchema),
    mode: "onChange",
    defaultValues: defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    name: "foodElementaryList",
    control,
  });

  const onSubmit: SubmitHandler<MealData> = async (data) => {
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

    const date = `${nowDate.getFullYear()}-${month}-${day}`;
    const mealType = selectedMealType;
    const foodElementaryList = data?.foodElementaryList?.map((item) => {
      return {
        foodElementaryId: item?.foodElementaryId?.value,
        weight: item.weight,
      };
    });

    const courseMealDayData = {
      courseMealDate: date,
    };

    let courseMealDayId: string | null = null;

    await doLazyGetCourseMealDayByDate(date)
      .unwrap()
      .then((response) => {
        if (response.items.length === 1) {
          courseMealDayId = response.items[0].id;
        } else {
          doCreateCourseMealDay(courseMealDayData)
            .unwrap()
            .then((responseCourseMealDayId) => {
              courseMealDayId = responseCourseMealDayId;
            })
            .catch((e) => console.log(e));
        }

        doLazyGetCourseMealDay(courseMealDayId)
          .unwrap()
          .then((courseMealDayData: ICourseMealDay) => {
            console.log("courseMealDayId", courseMealDayId);
            const courseMealId = courseMealDayData?.courseMeals?.find(
              (meal: ICourseMeal) => meal.mealTypeId == mealType
            )?.id;

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

    if (fields.length === 1) {
      remove(0);
      append({
        weight: 0,
      });
    }
  };

  const NoOptionsMessage = (props: NoticeProps) => {
    return (
      <components.NoOptionsMessage {...props}>
        <span className="">Ничего не нашлось</span>
      </components.NoOptionsMessage>
    );
  };

  const selectStyles: StylesConfig = {
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
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? "#C2BAFF" : "white",
    }),
  };

  const handleOptionChange = () => {
    trigger();
  };

  let checkIfFilledRight = () => {
    let emptyMeals = getValues("foodElementaryList").find(
      (item) => item.foodElementaryId === undefined
    );

    let weightErrors = errors?.foodElementaryList;

    let result = !emptyMeals && !weightErrors ? true : false;

    return result;
  };

  return (
    <section className="flex-grow-100 w-full flex flex-col flex-wrap justify-center items-center mb-3">
      <h2 className="mt-4 mb-3">Новая запись</h2>

      <div className="group relative w-full max-w-5xl">
        <div className="box_style"></div>
        <form
          className="box_content_transition flex flex-col flex-wrap justify-center w-full px-7 pt-5 pb-8"
          onSubmit={handleSubmit(onSubmit)}
        >
          <MealTypeOptions
            selectedMealType={selectedMealType}
            setSelectedMealType={setSelectedMealType}
          />

          <div className="flex flex-col">
            <h3 className="text-xl my-3">Блюда:</h3>

            {fields.map((field, index) => {
              return (
                <div key={field.id} className="form-control flex flex-col">
                  <div className="gap-x-3 flex mb-1">
                    <div className="flex flex-col justify-center gap-3 flex-grow mb-3">
                      <span className="flex gap-x-1">
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
                          <AsyncSelect
                            {...field}
                            key={index}
                            className="relative text-sm rounded-xl  "
                            components={{ NoOptionsMessage }}
                            styles={selectStyles}
                            placeholder="Введите название блюда"
                            loadOptions={loadOptions}
                            onInputChange={handleOptionChange}
                          />
                        )}
                      />
                    </div>

                    <div className="-mt-4 sm:max-w-[100px] max-w-[80px] flex-grow">
                      <InputIlluminated
                        id={`foodElementaryList.${index}.weight`}
                        type="number"
                        placeholder="Вес (г)"
                        disableIllumination={true}
                        additionalStyles=" h-[67px] border-0 "
                        register={{
                          ...register(
                            `foodElementaryList.${index}.weight` as const
                          ),
                        }}
                        isRequired={true}
                      />
                    </div>

                    {
                      <div className="max-w-[60px] flex flex-col justify-center items-center">
                        <h3 className="text-lg my-3"> </h3>
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
                          isDisabled={fields.length > 1 ? false : true}
                        />
                      </div>
                    }
                  </div>

                  {errors.foodElementaryList && (
                    <div
                      className={
                        Object.keys(errors).length > 0 &&
                        errors.foodElementaryList[index]
                          ? "flex flex-col mb-2 px-5 gap-y-2 justify-center"
                          : "hidden"
                      }
                    >
                      <p
                        className={
                          errors.foodElementaryList[index]?.foodElementaryId
                            ?.value
                            ? "text-pink-500 "
                            : " hidden "
                        }
                      >
                        {
                          errors.foodElementaryList[index]?.foodElementaryId
                            ?.value?.message
                        }
                      </p>
                      {/* <p
                        className={
                          errors.foodElementaryList[index]?.foodElementaryId
                            ? "text-pink-500 "
                            : " hidden "
                        }
                      >
                        {
                          errors.foodElementaryList[index]?.foodElementaryId
                            ?.value?.message
                        }
                      </p> */}
                      <p
                        className={
                          errors.foodElementaryList[index]?.weight
                            ? "text-pink-500 "
                            : " hidden "
                        }
                      >
                        {errors.foodElementaryList[index]?.weight?.message}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}

            <div className="w-full max-w-[280px]">
              <ButtonIlluminated
                label={"Еще одно блюдо"}
                isDarkButton={true}
                isIlluminationFull={false}
                onClick={() => {
                  append({
                    // foodElementaryId: undefined,
                    weight: 0,
                  });
                }}
                buttonPadding=" p-[14px] "
                additionalStyles=""
              />
            </div>
          </div>

          <div className="mt-9">
            <ButtonIlluminated
              label="Сохранить"
              isDarkButton={true}
              isIlluminationFull={false}
              isButton={true}
              type="submit"
              additionalStyles=""
              isDisabled={checkIfFilledRight() ? false : true}
            />
          </div>
        </form>
      </div>
    </section>
  );
};

export default MealCreateForm;
