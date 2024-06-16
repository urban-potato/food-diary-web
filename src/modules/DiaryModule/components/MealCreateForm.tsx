import { FC, useEffect, useRef, useState } from "react";
import { createValidationSchema } from "../constants/DiaryModule.constants";
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
  useGetAllMealTypesQuery,
  useLazyGetCourseMealDayByDateQuery,
} from "../api/meal.api";
import { getNowTime } from "../helpers/DiaryModule.helpers";
import NoOptionsMessage from "../../../components/NoOptionsMessage/NoOptionsMessage";
import { useGetAllFoodRecipeQuery } from "../../FoodRecipeModule/api/food-recipe.api";
import {
  IFoodElementary,
  IFoodRecipe,
  IMealType,
} from "../../../global/types/entities-types";

import Preloader from "../../../components/Preloader/Preloader";
import AsyncSelectRowWithWeightField from "../../../components/AsyncSelectRowWithWeightField/AsyncSelectRowWithWeightField";
import {
  ROUTES_LIST,
  SELECT_STYLES_SMALLER_HEIGHT,
} from "../../../global/constants/constants";
import { useAppDispatch } from "../../../global/store/store-hooks";
import { useNavigate } from "react-router-dom";
import { handleApiCallError } from "../../../global/helpers/handle-api-call-error.helper";
import { compareLabels } from "../../../global/helpers/compare-labels.helper";
import LoaderWithBlock from "../../../components/LoaderWithBlock/LoaderWithBlock";
import SelectRowWithWeightField from "../../../components/SelectRowWithWeightField/SelectRowWithWeightField";

type TProps = {
  setShowCreateForm: Function;
  showCreateForm: boolean;
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
    weight: string;
  }[];
};

type TSelectFood = {
  label: string;
  value: string;
  isElementary: boolean;
};

type TSelectMealType = {
  label: string;
  value: string;
};

const MealCreateForm: FC<TProps> = ({
  setShowCreateForm,
  showCreateForm,
  date,
}) => {
  const [selectFoodOptions, setSelectFoodOptions] = useState<
    Array<TSelectFood>
  >(new Array());
  const [mealTypeOptions, setMealTypeOptions] = useState<
    Array<TSelectMealType>
  >(new Array());
  const [selectedMealTypeOption, setSelectedMealTypeOption] =
    useState<TSelectMealType | null>(null);

  const newFoodForbiddenToAddIdsRef = useRef<Array<String>>(new Array());

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [mainlIsLoading, setMainIsLoading] = useState(false);

  const [doLazyGetCourseMealDayByDate] = useLazyGetCourseMealDayByDateQuery();
  const [doCreateCourseMealDay] = useCreateCourseMealDayMutation();
  const [doCreateCourseMeal] = useCreateCourseMealMutation();

  const [doAddConsumedElementary] = useAddConsumedElementaryMutation();
  const [doAddConsumedRecipe] = useAddConsumedRecipeMutation();

  // Food Elementaries for Async Select
  const {
    isLoading: isLoadingGetAllFoodElementary,
    data: dataGetAllFoodElementary,
    isError: isErrorGetAllFoodElementary,
    error: errorGetAllFoodElementary,
  } = useGetAllFoodElementaryQuery(undefined);

  if (
    isErrorGetAllFoodElementary &&
    errorGetAllFoodElementary &&
    "status" in errorGetAllFoodElementary
  ) {
    handleApiCallError({
      error: errorGetAllFoodElementary,
      dispatch: dispatch,
      navigate: navigate,
    });
  }

  // Food Recipes for Async Select
  const {
    isLoading: isLoadingGetAllFoodRecipe,
    data: dataGetAllFoodRecipe,
    isError: isErrorGetAllFoodRecipe,
    error: errorGetAllFoodRecipe,
  } = useGetAllFoodRecipeQuery(undefined);

  if (
    isErrorGetAllFoodRecipe &&
    errorGetAllFoodRecipe &&
    "status" in errorGetAllFoodRecipe
  ) {
    handleApiCallError({
      error: errorGetAllFoodRecipe,
      dispatch: dispatch,
      navigate: navigate,
    });
  }

  const loadSelectFoodOptions = () => {
    const filteredElementaryOptions = dataGetAllFoodElementary?.items?.map(
      (item) => {
        return { value: item.id, label: item.name, isElementary: true };
      }
    );

    const filteredRecipeOptions = dataGetAllFoodRecipe?.items?.map((item) => {
      return { value: item.id, label: item.name, isElementary: false };
    });

    const filteredOptions = filteredElementaryOptions
      ?.concat(filteredRecipeOptions)
      ?.filter(
        (item) => !newFoodForbiddenToAddIdsRef.current.includes(item?.value)
      );

    filteredOptions?.sort(compareLabels);

    setSelectFoodOptions(filteredOptions ?? []);
  };

  useEffect(() => {
    loadSelectFoodOptions();
  }, [dataGetAllFoodElementary, dataGetAllFoodRecipe]);

  const handleOnSelectInputChange = () => {
    trigger();
  };

  // Meal Types for Select
  const {
    isLoading: isLoadingGetAllMealTypes,
    data: dataGetAllMealTypes,
    isError: isErrorGetAllMealTypes,
    error: errorGetAllMealTypes,
    isSuccess: isSuccessGetAllMealTypes,
  } = useGetAllMealTypesQuery(undefined);

  if (
    isErrorGetAllMealTypes &&
    errorGetAllMealTypes &&
    "status" in errorGetAllMealTypes
  ) {
    handleApiCallError({
      error: errorGetAllMealTypes,
      dispatch: dispatch,
      navigate: navigate,
    });
  }

  // defaultValues
  let defaultValues = {
    creationTime: getNowTime(),
  };

  // useForm
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isValid },
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
    loadSelectFoodOptions();
  };

  const onSubmit: SubmitHandler<TMealCreateFormData> = async (data) => {
    setMainIsLoading(true);

    // Add Elementary List
    const addElementaryList = data?.addFoodList
      ?.filter((item) => item.foodInfo?.isElementary === true)
      .map((item) => {
        return {
          foodElementaryId: item?.foodInfo?.value,
          weight: item?.weight,
        };
      });

    // Add Recipe List
    const addRecipeList = data?.addFoodList
      ?.filter((item) => item.foodInfo?.isElementary === false)
      .map((item) => {
        return {
          foodRecipeId: item?.foodInfo?.value,
          weight: item?.weight,
        };
      });

    // Get Course Meal Day
    let courseMealDayId: string | null = null;

    await doLazyGetCourseMealDayByDate(date)
      .unwrap()
      .then((response) => {
        if (response.items.length === 1) {
          courseMealDayId = response.items[0].id;
        }
      })
      .catch((error) => {
        handleApiCallError({
          error: error,
          dispatch: dispatch,
          navigate: navigate,
        });
      });

    if (courseMealDayId === null) {
      const courseMealDayData = {
        courseMealDate: date,
      };

      await doCreateCourseMealDay(courseMealDayData)
        .unwrap()
        .then((responseCourseMealDayId) => {
          courseMealDayId = responseCourseMealDayId;
        })
        .catch((error) => {
          handleApiCallError({
            error: error,
            dispatch: dispatch,
            navigate: navigate,
          });
        });
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
      .catch((error) => {
        handleApiCallError({
          error: error,
          dispatch: dispatch,
          navigate: navigate,
        });
      });

    // Add New Consumed Elementaries
    for (const [index, foodElementary] of addElementaryList.entries()) {
      const addFoodElementaryData = {
        id: courseMealId,
        data: {
          foodElementaryId: foodElementary.foodElementaryId,
          weight: foodElementary.weight,
        },
        isInvalidationNeeded:
          index == addElementaryList.length - 1 && addRecipeList.length == 0
            ? true
            : false,
      };

      await doAddConsumedElementary(addFoodElementaryData)
        .unwrap()
        .catch((error) => {
          handleApiCallError({
            error: error,
            dispatch: dispatch,
            navigate: navigate,
          });
        });
    }

    // Add New Consumed Recipes
    for (const [index, foodRecipe] of addRecipeList.entries()) {
      const addFoodRecipeData = {
        id: courseMealId,
        data: {
          foodRecipeId: foodRecipe.foodRecipeId,
          weight: foodRecipe.weight,
        },
        isInvalidationNeeded: index == addRecipeList.length - 1 ? true : false,
      };

      await doAddConsumedRecipe(addFoodRecipeData)
        .unwrap()
        .catch((error) => {
          handleApiCallError({
            error: error,
            dispatch: dispatch,
            navigate: navigate,
          });
        });
    }

    setMainIsLoading(false);
    reset();

    // Reset Async Select Field,
    // because it stays the same if there was only one
    if (addFoodListFields.length === 1) {
      addFoodListRemove(0);
      addFoodListAppend({
        weight: "0",
      });
    }

    setShowCreateForm(!showCreateForm);
  };

  const handleOnSelectValueChange = (
    newElement: TSelectFood,
    addFoodIndex: number
  ) => {
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

    loadSelectFoodOptions();
  };

  const handleAddSelect = () => {
    newFoodForbiddenToAddIdsRef.current.push("");

    addFoodListAppend({
      weight: "0",
    });
  };

  useEffect(() => {
    handleAddSelect();
  }, []);

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

      const selectOptions: TSelectMealType[] = [];

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
    <section className="flex-grow-100 w-full flex flex-col flex-wrap justify-start items-center mb-3">
      <h2 className="mt-4 mb-3">Новая запись</h2>

      <div className="outer_box_style group w-full max-w-5xl mt-5">
        <div className="box_style"></div>

        {mainlIsLoading && <LoaderWithBlock className="loader_with_block" />}

        <form
          className="box_content_transition flex flex-col flex-wrap w-full justify-center p-7"
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="off"
        >
          {isLoadingGetAllMealTypes ||
          isLoadingGetAllFoodElementary ||
          isLoadingGetAllFoodRecipe ? (
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
                    inputLabel="Время"
                    register={{
                      ...register("creationTime"),
                    }}
                    isRequired={true}
                    className="h-[56px]"
                    isError={!!errors?.creationTime}
                    errorMessagesList={
                      [errors?.creationTime?.message].filter(
                        (item) => !!item
                      ) as string[]
                    }
                  />
                </div>

                <div className="flex flex-col justify-center w-full h-full gap-1 flex-grow">
                  <span className="flex gap-x-1">
                    <h3>Тип</h3>
                    <p className="text-red">*</p>
                  </span>

                  <Select
                    defaultValue={selectedMealTypeOption}
                    onChange={(newValue) =>
                      setSelectedMealTypeOption(newValue as TSelectMealType)
                    }
                    options={mealTypeOptions}
                    placeholder={
                      <div className="text-black">
                        {selectedMealTypeOption?.label}
                      </div>
                    }
                    className="relative text-sm rounded-xl"
                    components={{ NoOptionsMessage: NoOptionsMessage() }}
                    styles={SELECT_STYLES_SMALLER_HEIGHT}
                    isSearchable={false}
                  />
                </div>
              </div>

              <div className="flex flex-col">
                {addFoodListFields.map((item, index) => {
                  return (
                    <SelectRowWithWeightField
                      key={`MealCreateForm_Div_addFoodList_${item.id}_${index}`}
                      itemId={item.id}
                      itemIndex={index}
                      label={"Блюдо"}
                      selectPlaceholder={"Название..."}
                      handleRemoveItem={handleRemoveFoodToAdd}
                      controllerName={`addFoodList.${index}.foodInfo` as const}
                      control={control}
                      register={{
                        ...register(`addFoodList.${index}.weight` as const),
                      }}
                      handleOnSelectInputChange={handleOnSelectInputChange}
                      handleOnSelectValueChange={handleOnSelectValueChange}
                      isDeleteButtonDisabled={
                        addFoodListFields.length < 2 ? true : false
                      }
                      hasErrors={!!errors?.addFoodList}
                      errorMessagesList={
                        [
                          errors?.addFoodList?.[index]?.foodInfo?.value
                            ?.message,
                          errors?.addFoodList?.[index]?.weight?.message,
                        ].filter((item) => !!item) as string[]
                      }
                      linkForNoOptionsMessage={`${ROUTES_LIST.foodSimple}#`}
                      selectOptions={selectFoodOptions}
                    />
                  );
                })}

                <div className="w-full max-w-[280px] mt-3">
                  <ButtonIlluminated
                    children={"Еще одно блюдо"}
                    type="button"
                    onClick={() => handleAddSelect()}
                    className="p-[12px]"
                    isDisabled={isValid ? false : true}
                  />
                </div>
              </div>

              <div className="mt-5">
                <ButtonIlluminated
                  children={"Сохранить"}
                  type="submit"
                  isDisabled={isValid ? false : true}
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
