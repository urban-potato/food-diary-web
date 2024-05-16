import { FC, useEffect, useRef, useState } from "react";
import {
  BREAKFAST_DEFAULT_ID,
  selectStyles,
  createValidationSchema,
  selectMealTypeStyles,
} from "../constants/constants";
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ButtonIlluminated from "../../../ui/ButtonIlluminated/ButtonIlluminated";
import { useGetAllFoodElementaryQuery } from "../../FoodElementaryModule";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import InputIlluminated from "../../../ui/InputIlluminated/InputIlluminated";
import {
  useAddConsumedElementaryMutation,
  useAddConsumedRecipeMutation,
  useCreateCourseMealDayMutation,
  useCreateCourseMealMutation,
  useLazyGetCourseMealDayByDateQuery,
} from "../api/meals.api";
import { Player } from "@lordicon/react";
import DELETE_ICON from "../../../global/assets/system-regular-39-trash.json";
import { getNowTime } from "../helpers/helpers";
import NoOptionsMessage from "../../../components/NoOptionsMessage/NoOptionsMessage";
import { useGetAllFoodRecipeQuery } from "../../FoodRecipeModule/api/foodRecipe.api";
import {
  IFoodElementary,
  IFoodRecipe,
  IMealType,
} from "../../../global/types/types";
import { useGetAllMealTypesQuery } from "../api/mealTypes.api";
import Preloader from "../../../components/Preloader/Preloader";

type TProps = {
  setShowCreateForm: Function;
  date: string;
};

type TMealCreateFormData = {
  creationTime: string;
  addFoodList: {
    foodInfo?: {
      label: string;
      value: string;
      isElementary: boolean;
    };
    weight: number;
  }[];
};

type TSelectElement = {
  label: string;
  value: string;
  isElementary: boolean;
};

type TSelectOption = {
  label: string;
  value: string;
};

const MealCreateForm: FC<TProps> = ({ setShowCreateForm, date }) => {
  const [mealTypeOptions, setMealTypeOptions] = useState<Array<TSelectOption>>(
    new Array()
  );
  const [selectedMealTypeOption, setSelectedMealTypeOption] =
    useState<TSelectOption | null>(null);

  const newFoodForbiddenToAddIdsRef = useRef<Array<String>>(new Array());

  const deleteIconPlayerRef = useRef<Player>(null);
  const ICON_SIZE = 28;

  const [doLazyGetCourseMealDayByDate] = useLazyGetCourseMealDayByDateQuery();
  const [doCreateCourseMealDay] = useCreateCourseMealDayMutation();
  const [doCreateCourseMeal] = useCreateCourseMealMutation();

  const [doAddConsumedElementary] = useAddConsumedElementaryMutation();
  const [doAddConsumedRecipe] = useAddConsumedRecipeMutation();

  // Food Elementaries for Async Select
  const {
    isLoading: isLoadingGetAllFoodElementary,
    data: dataGetAllFoodElementary,
    error: errorGetAllFoodElementary,
  } = useGetAllFoodElementaryQuery(undefined);

  // Food Recipes for Async Select
  const {
    isLoading: isLoadingGetAllFoodRecipe,
    data: dataGetAllFoodRecipe,
    error: errorGetAllFoodRecipe,
  } = useGetAllFoodRecipeQuery(undefined);

  const loadOptions = (searchValue: string, callback: any) => {
    const filteredElementaryData: IFoodElementary[] =
      dataGetAllFoodElementary?.items.filter((item: IFoodElementary) =>
        item.name.toLowerCase().includes(searchValue.toLowerCase())
      );

    const filteredElementaryOptions = filteredElementaryData.map((item) => {
      return { value: item.id, label: item.name, isElementary: true };
    });

    const filteredReipeData: IFoodRecipe[] = dataGetAllFoodRecipe?.items.filter(
      (item: IFoodRecipe) =>
        item.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    const filteredRecipeOptions = filteredReipeData.map((item) => {
      return { value: item.id, label: item.name, isElementary: false };
    });

    const filteredOptions = filteredElementaryOptions
      .concat(filteredRecipeOptions)
      .filter(
        (item) => !newFoodForbiddenToAddIdsRef.current.includes(item.value)
      );

    callback(filteredOptions);
  };

  // Meal Types for Select
  const {
    isLoading: isLoadingGetAllMealTypes,
    data: dataGetAllMealTypes,
    error: errorGetAllMealTypes,
    isSuccess: isSuccessGetAllMealTypes,
  } = useGetAllMealTypesQuery(undefined);

  // defaultValues
  let defaultValues = {
    addFoodList: [
      {
        weight: 0,
      },
    ],
    creationTime: getNowTime(),
  };

  // useForm
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
    getValues,
    control,
    trigger,
  } = useForm<TMealCreateFormData>({
    resolver: yupResolver(createValidationSchema),
    mode: "onChange",
    defaultValues: defaultValues,
  });

  // For Generating Add food Fields
  const {
    fields: addFoodListFields,
    append: addFoodListAppend,
    remove: addFoodListRemove,
  } = useFieldArray({
    name: "addFoodList",
    control,
  });

  const handleRemoveFoodToAdd = (itemIndex: number) => {
    if (
      itemIndex > -1 &&
      itemIndex < newFoodForbiddenToAddIdsRef.current.length
    ) {
      newFoodForbiddenToAddIdsRef.current.splice(itemIndex, 1);
    }

    addFoodListRemove(itemIndex);
  };

  const onSubmit: SubmitHandler<TMealCreateFormData> = async (data) => {
    // Get Course Meal Day
    let courseMealDayId: string | null = null;

    await doLazyGetCourseMealDayByDate(date)
      .unwrap()
      .then((response) => {
        if (response.items.length === 1) {
          courseMealDayId = response.items[0].id;
        }
      })
      .catch((e) => console.log(e));

    if (courseMealDayId === null) {
      const courseMealDayData = {
        courseMealDate: date,
      };

      await doCreateCourseMealDay(courseMealDayData)
        .unwrap()
        .then((responseCourseMealDayId) => {
          courseMealDayId = responseCourseMealDayId;
        })
        .catch((e) => console.log(e));
    }

    const time = data.creationTime.toString().concat(":00");
    const mealType = selectedMealTypeOption?.value;
    let courseMealId: string | null = null;

    const createCourseMealData = {
      mealTypeId: mealType,
      courseMealDayId: courseMealDayId,
      courseMealTime: time,
    };

    await doCreateCourseMeal(createCourseMealData)
      .unwrap()
      .then((responseCourseMealId) => {
        courseMealId = responseCourseMealId;
      })
      .catch((e) => console.log(e));

    // Add New Consumed Elementaries
    const addElementaryList = data?.addFoodList
      ?.filter((item) => item.foodInfo?.isElementary === true)
      .map((item) => {
        return {
          foodElementaryId: item?.foodInfo?.value,
          weight: item?.weight,
        };
      });

    for (const foodElementary of addElementaryList) {
      const addFoodElementaryData = {
        id: courseMealId,
        data: {
          foodElementaryId: foodElementary.foodElementaryId,
          weight: foodElementary.weight,
        },
      };

      await doAddConsumedElementary(addFoodElementaryData).catch((e) =>
        console.log(e)
      );

      console.log("Add New Consumed Elementaries");
    }

    // Add New Consumed Recipes
    const addRecipeList = data?.addFoodList
      ?.filter((item) => item.foodInfo?.isElementary === false)
      .map((item) => {
        return {
          foodRecipeId: item?.foodInfo?.value,
          weight: item?.weight,
        };
      });

    for (const foodRecipe of addRecipeList) {
      const addFoodRecipeData = {
        id: courseMealId,
        data: {
          foodRecipeId: foodRecipe.foodRecipeId,
          weight: foodRecipe.weight,
        },
      };

      await doAddConsumedRecipe(addFoodRecipeData).catch((e) => console.log(e));

      console.log("Add New Consumed Recipes");
    }

    reset();

    // Reset Async Select Field,
    // because it stays the same if there was only one
    if (addFoodListFields.length === 1) {
      addFoodListRemove(0);
      addFoodListAppend({
        weight: 0,
      });
    }

    setShowCreateForm(false);
  };

  const handleOnInputChange = () => {
    trigger();
  };

  const handleOnChange = (newElement: TSelectElement, addFoodIndex: number) => {
    if (
      addFoodIndex > -1 &&
      addFoodIndex < newFoodForbiddenToAddIdsRef.current.length
    ) {
      newFoodForbiddenToAddIdsRef.current.splice(
        addFoodIndex,
        1,
        newElement.value
      );
    }
  };

  let checkIfFilledRight = () => {
    let emptyMeals = getValues("addFoodList")?.find(
      (item) => item.foodInfo === undefined
    );

    const isAddFoodListEmply = !getValues("addFoodList")?.length;

    let addFoodWeightErrors = errors?.addFoodList;

    let result =
      !emptyMeals && !addFoodWeightErrors && !isAddFoodListEmply ? true : false;

    return result;
  };

  useEffect(() => {
    if (isSuccessGetAllMealTypes) {
      const mealTypeOptions = dataGetAllMealTypes.items;
      const sortedMealTypeOptions = [
        mealTypeOptions.find(
          (item: IMealType) =>
            item.name.toLowerCase() == "завтрак" && item.isDefault
        ),
        mealTypeOptions.find(
          (item: IMealType) =>
            item.name.toLowerCase() == "обед" && item.isDefault
        ),
        mealTypeOptions.find(
          (item: IMealType) =>
            item.name.toLowerCase() == "ужин" && item.isDefault
        ),
      ];

      const selectOptions: TSelectOption[] = [];

      sortedMealTypeOptions.forEach((item: IMealType) =>
        selectOptions.push({
          label: item.name,
          value: item.id,
        })
      );

      setMealTypeOptions(selectOptions);
      setSelectedMealTypeOption(selectOptions[0]);
    }
  }, [dataGetAllMealTypes]);

  return (
    <section className="flex-grow-100 w-full flex flex-col flex-wrap justify-center items-center mb-3">
      <h2 className="mt-4 mb-3">Новая запись</h2>

      <div className="group relative w-full max-w-5xl">
        <div className="box_style"></div>
        <form
          className="box_content_transition flex flex-col flex-wrap justify-center w-full px-7 pt-5 pb-8"
          onSubmit={handleSubmit(onSubmit)}
        >
          {isLoadingGetAllMealTypes ? (
            <div className="flex justify-center items-center">
              <Preloader />
            </div>
          ) : (
            <>
              <div className="w-full flex-grow flex flex-wrap sm:flex-nowrap justify-center items-end gap-2 mb-5">
                <div className="w-full">
                  <InputIlluminated
                    id={"FoodRecipeCreateForm_creationTime"}
                    type="time"
                    placeholder="Время"
                    disableIllumination={true}
                    additionalStyles=" h-[56px] border-0 "
                    register={{
                      ...register("creationTime"),
                    }}
                    isRequired={true}
                  />
                  {errors.creationTime && (
                    <div
                      className={
                        Object.keys(errors).length > 0
                          ? " flex flex-col gap-y-2 justify-center "
                          : " hidden "
                      }
                    >
                      <p
                        className={
                          errors.creationTime ? "text-pink-500 " : " hidden "
                        }
                      >
                        {errors.creationTime?.message}
                      </p>
                    </div>
                  )}
                </div>

                <div className=" gap-x-3 flex flex-col justify-center w-full h-full gap-2 flex-grow ">
                  <span className="flex gap-x-1">
                    <h3>Тип</h3>
                    <p className="text-red">*</p>
                  </span>

                  <Select
                    defaultValue={selectedMealTypeOption}
                    onChange={(newValue) =>
                      setSelectedMealTypeOption(newValue as TSelectOption)
                    }
                    options={mealTypeOptions}
                    placeholder={
                      <div className="text-black">
                        {selectedMealTypeOption?.label}
                      </div>
                    }
                    className="relative text-sm rounded-xl"
                    components={{ NoOptionsMessage }}
                    styles={selectMealTypeStyles}
                    isSearchable={false}
                  />
                </div>
              </div>

              <div className="flex flex-col">
                {addFoodListFields.map((select, index) => {
                  return (
                    <div
                      key={`MealCreateForm_Div_addFoodList_${select.id}_${index}`}
                      className="form-control flex flex-col"
                    >
                      <div className="gap-x-3 flex mb-1">
                        <div className="flex flex-col justify-center gap-3 flex-grow mb-3">
                          <span className="flex gap-x-1">
                            <h3>Блюдо</h3>
                            <p className="text-red">*</p>
                          </span>
                          <Controller
                            key={`MealCreateForm_Controller_addFoodList_${select.id}_${index}`}
                            name={`addFoodList.${index}.foodInfo` as const}
                            control={control}
                            render={({ field }) => (
                              <AsyncSelect
                                {...field}
                                key={`MealCreateForm_AsyncSelect_addFoodList_${select.id}_${index}`}
                                className="relative text-sm rounded-xl  "
                                components={{ NoOptionsMessage }}
                                styles={selectStyles}
                                placeholder="Введите название блюда"
                                loadOptions={loadOptions}
                                onInputChange={handleOnInputChange}
                                onChange={(newValue) => {
                                  handleOnChange(
                                    newValue as TSelectElement,
                                    index
                                  );
                                  field.onChange(newValue);
                                }}
                              />
                            )}
                          />
                        </div>

                        <div className="-mt-4 sm:max-w-[100px] max-w-[80px] flex-grow">
                          <InputIlluminated
                            id={`MealCreateForm_addFoodList.${index}.weight`}
                            type="number"
                            placeholder="Вес (г)"
                            disableIllumination={true}
                            additionalStyles=" h-[67px] border-0 "
                            register={{
                              ...register(
                                `addFoodList.${index}.weight` as const
                              ),
                            }}
                            isRequired={true}
                          />
                        </div>

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
                              handleRemoveFoodToAdd(index);
                            }}
                            buttonPadding=" p-[14px] "
                            additionalStyles=" "
                            isDisabled={
                              addFoodListFields.length > 1 ? false : true
                            }
                          />
                        </div>
                      </div>

                      {errors.addFoodList && (
                        <div
                          className={
                            Object.keys(errors).length > 0 &&
                            errors.addFoodList[index]
                              ? "flex flex-col mb-2 px-5 gap-y-2 justify-center"
                              : "hidden"
                          }
                        >
                          <p
                            className={
                              errors.addFoodList[index]?.foodInfo?.value
                                ? "text-pink-500 "
                                : " hidden "
                            }
                          >
                            {
                              errors.addFoodList[index]?.foodInfo?.value
                                ?.message
                            }
                          </p>
                          <p
                            className={
                              errors.addFoodList[index]?.weight
                                ? "text-pink-500 "
                                : " hidden "
                            }
                          >
                            {errors.addFoodList[index]?.weight?.message}
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
                      newFoodForbiddenToAddIdsRef.current.push("");

                      addFoodListAppend({
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
            </>
          )}
        </form>
      </div>
    </section>
  );
};

export default MealCreateForm;
