import { FC, useEffect, useRef, useState } from "react";
import {
  createValidationSchema,
  selectMealTypeStyles,
} from "../constants/constants";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ButtonIlluminated from "../../../ui/ButtonIlluminated/ButtonIlluminated";
import { useGetAllFoodElementaryQuery } from "../../FoodElementaryModule";
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
import AsyncSelectRowWithWeightField from "../../../components/AsyncSelectRowWithWeightField/AsyncSelectRowWithWeightField";

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

      <div className="outer_box_style group w-full max-w-5xl mt-5">
        <div className="box_style"></div>
        <form
          className="box_content_transition flex flex-col flex-wrap w-full justify-center p-7"
          onSubmit={handleSubmit(onSubmit)}
        >
          {isLoadingGetAllMealTypes ? (
            <div className="flex justify-center items-center">
              <Preloader />
            </div>
          ) : (
            <>
              <div className="w-full flex-grow flex flex-wrap sm:flex-nowrap justify-center items-start gap-y-1 gap-x-3 mb-5">
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
                          ? "flex flex-col mt-1 gap-y-1 justify-center items-start"
                          : "hidden"
                      }
                    >
                      <p
                        className={
                          errors.creationTime ? "text-pink-500" : "hidden"
                        }
                      >
                        {"• Время: " + errors.creationTime?.message}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col justify-center w-full h-full gap-1 flex-grow">
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
                {addFoodListFields.map((item, index) => {
                  return (
                    <AsyncSelectRowWithWeightField
                      key={`MealCreateForm_Div_addFoodList_${item.id}_${index}`}
                      itemId={item.id}
                      itemIndex={index}
                      label={"Блюдо"}
                      selectPlaceholder={"Введите название блюда"}
                      handleRemoveItem={handleRemoveFoodToAdd}
                      controllerName={`addFoodList.${index}.foodInfo` as const}
                      control={control}
                      register={{
                        ...register(`addFoodList.${index}.weight` as const),
                      }}
                      errors={errors}
                      errorsGroup={errors.addFoodList}
                      errorSelect={errors.addFoodList?.[index]?.foodInfo?.value}
                      errorFeild={errors.addFoodList?.[index]?.weight}
                      loadSelectOptions={loadOptions}
                      handleOnSelectInputChange={handleOnInputChange}
                      handleOnSelectValueChange={handleOnChange}
                      isDeleteButtonDisabled={
                        addFoodListFields.length < 2 ? true : false
                      }
                    />
                  );
                })}

                <div className="w-full max-w-[280px] mt-3">
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
                    isIttuminationDisabled={true}
                  />
                </div>
              </div>

              <div className="mt-5">
                <ButtonIlluminated
                  label="Сохранить"
                  isDarkButton={true}
                  isIlluminationFull={false}
                  isButton={true}
                  type="submit"
                  additionalStyles=""
                  isDisabled={checkIfFilledRight() ? false : true}
                  isIttuminationDisabled={true}
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
