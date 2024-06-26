import { FC, useEffect, useRef, useState } from "react";
import { editValidationSchema } from "../../constants/DiaryModule.constants";
import {
  useAddConsumedElementaryMutation,
  useChangeConsumedElementaryWeightMutation,
  useDeleteConsumedElementaryMutation,
  useChangeMealTypeMutation,
  useAddConsumedRecipeMutation,
  useChangeConsumedRecipeWeightMutation,
  useDeleteConsumedRecipeMutation,
  useGetAllMealTypesQuery,
  useCreateCourseMealMutation,
  useDeleteCourseMealMutation,
} from "../../api/meal.api";
import { useGetAllFoodElementaryQuery } from "../../../FoodElementaryModule";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ButtonIlluminated from "../../../../ui/ButtonIlluminated/ButtonIlluminated";
import Select from "react-select";
import { useGetAllFoodRecipeQuery } from "../../../FoodRecipeModule/api/food-recipe.api";
import {
  IConsumedElementary,
  IConsumedRecipe,
  IFoodElementary,
  IFoodRecipe,
  IMealType,
} from "../../../../global/types/entities-types";
import Preloader from "../../../../components/Preloader/Preloader";
import DisabledSelectRowWithWeightField from "../../../../components/DisabledSelectRowWithWeightField/DisabledSelectRowWithWeightField";
import {
  ROUTES_LIST,
  SELECT_STYLES_SMALLER_HEIGHT,
} from "../../../../global/constants/constants";
import { handleApiCallError } from "../../../../global/helpers/handle-api-call-error.helper";
import { useAppDispatch } from "../../../../global/store/store-hooks";
import { useNavigate } from "react-router-dom";
import InputIlluminated from "../../../../ui/InputIlluminated/InputIlluminated";
import { compareLabels } from "../../../../global/helpers/compare-labels.helper";
import NoOptionsMessage from "../../../../components/NoOptionsMessage/NoOptionsMessage";
import SelectRowWithWeightField from "../../../../components/SelectRowWithWeightField/SelectRowWithWeightField";

type TProps = {
  originalCourseMealId: string;
  originalCreationTime: string;
  originalMealTypeId: string;
  originalConsumedElementaries: IConsumedElementary[];
  originalConsumedRecipes: IConsumedRecipe[];
  setIsEditMode: Function;
  isEditMode: boolean;
  originalMealDayId: string;
  setMainIsLoading: Function;
};

type TMealEditFormData = {
  creationTime: string;
  addFoodList: {
    foodInfo?: {
      label: string;
      value: string;
      isElementary: boolean;
    };
    weight: string;
  }[];
  originalFoodElementaryList: {
    foodElementaryId: {
      label: string;
      value: string;
    };
    weight: string;
  }[];
  originalFoodRecipeList: {
    foodRecipeId: {
      label: string;
      value: string;
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

type TAddElementariesList = {
  foodElementaryId: string;
  weight: string;
}[];

type TAddRecipesList = {
  foodRecipeId: string;
  weight: string;
}[];

const MealEditForm: FC<TProps> = ({
  originalCourseMealId,
  originalCreationTime,
  originalMealTypeId,
  originalConsumedElementaries,
  originalConsumedRecipes,
  setIsEditMode,
  isEditMode,
  originalMealDayId,
  setMainIsLoading,
}) => {
  const [selectFoodOptions, setSelectFoodOptions] = useState<
    Array<TSelectFood>
  >(new Array());
  const [mealTypeOptions, setMealTypeOptions] = useState<
    Array<TSelectMealType>
  >(new Array());
  const [selectedMealTypeOption, setSelectedMealTypeOption] = useState<
    TSelectMealType | null | undefined
  >(null);

  const foodForbiddenToAddIdsRef = useRef<Array<String>>(new Array());
  const newFoodForbiddenToAddIdsRef = useRef<Array<String>>(new Array());

  // Elementaries to delete
  const originalElementariesToRemoveIdsRef = useRef<Array<String>>(new Array());
  // Recipes to delete
  const originalRecipesToRemoveIdsRef = useRef<Array<String>>(new Array());

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [doCreateCourseMeal] = useCreateCourseMealMutation();
  const [doDeleteCourseMeal] = useDeleteCourseMealMutation();

  const [doChangeMealType] = useChangeMealTypeMutation();

  // Edit Elementary
  const [doAddConsumedElementary] = useAddConsumedElementaryMutation();
  const [doChangeConsumedElementaryWeight] =
    useChangeConsumedElementaryWeightMutation();
  const [doDeleteConsumedElementary] = useDeleteConsumedElementaryMutation();

  // Edit Recipe
  const [doAddConsumedRecipe] = useAddConsumedRecipeMutation();
  const [doChangeConsumedRecipeWeight] =
    useChangeConsumedRecipeWeightMutation();
  const [doDeleteConsumedRecipe] = useDeleteConsumedRecipeMutation();

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
    const filteredElementaryOptions: TSelectFood[] =
      dataGetAllFoodElementary?.items?.map((item: IFoodElementary) => {
        return { value: item.id, label: item.name, isElementary: true };
      });

    const filteredRecipeOptions: TSelectFood[] =
      dataGetAllFoodRecipe?.items?.map((item: IFoodRecipe) => {
        return { value: item.id, label: item.name, isElementary: false };
      });

    const filteredOptions = filteredElementaryOptions
      ?.concat(filteredRecipeOptions)
      ?.filter(
        (item: TSelectFood) =>
          !foodForbiddenToAddIdsRef.current.includes(item?.value) &&
          !newFoodForbiddenToAddIdsRef.current.includes(item?.value)
      );

    filteredOptions?.sort(compareLabels);

    setSelectFoodOptions(filteredOptions ?? []);
  };

  useEffect(() => {
    loadSelectFoodOptions();
  }, [dataGetAllFoodElementary, dataGetAllFoodRecipe]);

  // defaultValues
  let defaultValues = {
    creationTime: originalCreationTime,
  };

  // useForm
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
    control,
    trigger,
  } = useForm<TMealEditFormData>({
    resolver: yupResolver(editValidationSchema),
    mode: "onChange",
    defaultValues: defaultValues,
  });

  // For Generating Original Elementaries Fields
  const {
    fields: originalElementaryFields,
    append: originalElementaryAppend,
    remove: originalElementaryRemove,
  } = useFieldArray({
    name: "originalFoodElementaryList",
    control,
  });

  // For Generating Original Recipes Fields
  const {
    fields: originalRecipeFields,
    append: originalRecipeAppend,
    remove: originalRecipeRemove,
  } = useFieldArray({
    name: "originalFoodRecipeList",
    control,
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

  const handleRemoveOriginalElementary = (itemIndex: number) => {
    const elementaryId = getValues(
      `originalFoodElementaryList.${itemIndex}.foodElementaryId.value`
    );

    originalElementariesToRemoveIdsRef.current.push(elementaryId);

    const indexInFoodForbiddenToAddIdsRef =
      foodForbiddenToAddIdsRef.current.indexOf(elementaryId);

    if (indexInFoodForbiddenToAddIdsRef > -1) {
      foodForbiddenToAddIdsRef.current.splice(
        indexInFoodForbiddenToAddIdsRef,
        1
      );
    }

    originalElementaryRemove(itemIndex);

    loadSelectFoodOptions();
  };

  const handleRemoveOriginalRecipe = (itemIndex: number) => {
    const recipeId = getValues(
      `originalFoodRecipeList.${itemIndex}.foodRecipeId.value`
    );

    originalRecipesToRemoveIdsRef.current.push(recipeId);

    const indexInFoodForbiddenToAddIdsRef =
      foodForbiddenToAddIdsRef.current.indexOf(recipeId);

    if (indexInFoodForbiddenToAddIdsRef > -1) {
      foodForbiddenToAddIdsRef.current.splice(
        indexInFoodForbiddenToAddIdsRef,
        1
      );
    }

    originalRecipeRemove(itemIndex);

    loadSelectFoodOptions();
  };

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

  const onSubmit: SubmitHandler<TMealEditFormData> = async (data) => {
    setMainIsLoading(true);

    const isChangeTimeNeeded = originalCreationTime != data.creationTime;

    // Delete Elementaries List
    const deleteElementariesList = originalElementariesToRemoveIdsRef.current;
    // Delete Recipes List
    const deleteRecipesList = originalRecipesToRemoveIdsRef.current;

    // Change Elementaries List
    let changeElementariesList = [];

    const originalElementaryList = data?.originalFoodElementaryList?.map(
      (item) => {
        return {
          foodElementaryId: item?.foodElementaryId?.value,
          weight: item?.weight,
        };
      }
    );

    const consumedElementariesWithoutDeleted =
      originalConsumedElementaries.filter(
        (item) => !deleteElementariesList.includes(item.foodElementary.id)
      );

    for (const originalElementary of originalElementaryList) {
      const consumedElementaryToChange =
        consumedElementariesWithoutDeleted.find(
          (item) =>
            item.foodElementary.id == originalElementary.foodElementaryId
        );

      if (
        consumedElementaryToChange != undefined &&
        consumedElementaryToChange.elementaryInMealWeight.toString() !=
          originalElementary.weight
      ) {
        changeElementariesList.push(originalElementary);
      }
    }

    // Change Recipes List
    let changeRecipesList = [];

    const originalRecipeList = data?.originalFoodRecipeList?.map((item) => {
      return {
        foodRecipeId: item?.foodRecipeId?.value,
        weight: item?.weight,
      };
    });

    const consumedRecipesWithoutDeleted = originalConsumedRecipes.filter(
      (item) => !deleteRecipesList.includes(item.foodRecipe.id)
    );

    for (const originalRecipe of originalRecipeList) {
      const consumedRecipeToChange = consumedRecipesWithoutDeleted.find(
        (item) => item.foodRecipe.id == originalRecipe.foodRecipeId
      );

      if (
        consumedRecipeToChange != undefined &&
        consumedRecipeToChange.recipeInMealWeight.toString() !=
          originalRecipe.weight
      ) {
        changeRecipesList.push(originalRecipe);
      }
    }

    // Add Elementaries List
    const addElementariesList = data?.addFoodList
      ?.filter((item) => item.foodInfo?.isElementary === true)
      .map((item) => {
        return {
          foodElementaryId: item?.foodInfo?.value,
          weight: item?.weight,
        };
      });

    // Add Recipes List
    const addRecipesList = data?.addFoodList
      ?.filter((item) => item.foodInfo?.isElementary === false)
      .map((item) => {
        return {
          foodRecipeId: item?.foodInfo?.value,
          weight: item?.weight,
        };
      });

    // if Change Time Needed
    if (isChangeTimeNeeded) {
      const time = data.creationTime.toString().concat(":00");
      const mealType = selectedMealTypeOption?.value;
      // let courseMealId: string | null = null;

      const createCourseMealData = {
        mealTypeId: mealType,
        courseMealDayId: originalMealDayId,
        courseMealTime: time,
      };

      const finalAddElementariesList = originalElementaryList.concat(
        addElementariesList as TAddElementariesList
      );
      const finalAddRecipesList = originalRecipeList.concat(
        addRecipesList as TAddRecipesList
      );

      await doCreateCourseMeal(createCourseMealData)
        .unwrap()
        .then(async (responseCourseMealId) => {
          // Add New Consumed Elementaries
          for (const foodElementary of finalAddElementariesList) {
            const addFoodElementaryData = {
              id: responseCourseMealId,
              data: {
                foodElementaryId: foodElementary.foodElementaryId,
                weight: foodElementary.weight,
              },
              isInvalidationNeeded: false,
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
          for (const foodRecipe of finalAddRecipesList) {
            const addFoodRecipeData = {
              id: responseCourseMealId,
              data: {
                foodRecipeId: foodRecipe.foodRecipeId,
                weight: foodRecipe.weight,
              },
              isInvalidationNeeded: false,
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

          await doDeleteCourseMeal(originalCourseMealId)
            .unwrap()
            .catch((error) => {
              handleApiCallError({
                error: error,
                dispatch: dispatch,
                navigate: navigate,
              });
            });
        })
        .catch((error) => {
          handleApiCallError({
            error: error,
            dispatch: dispatch,
            navigate: navigate,
          });
        });
    } else {
      // Change Meal Type
      const mealType = selectedMealTypeOption?.value;
      if (mealType != originalMealTypeId) {
        const changeMealTypeData = {
          courseMealId: originalCourseMealId,
          data: {
            mealTypeId: mealType,
          },
          isInvalidationNeeded:
            deleteElementariesList.length +
              deleteRecipesList.length +
              changeElementariesList.length +
              changeRecipesList.length +
              addElementariesList.length +
              addRecipesList.length >
            0
              ? false
              : true,
        };

        await doChangeMealType(changeMealTypeData)
          .unwrap()
          .catch((error) => {
            handleApiCallError({
              error: error,
              dispatch: dispatch,
              navigate: navigate,
            });
          });
      }

      // Delete Consumed Elementaries
      for (const [
        index,
        elementaryToDeleteId,
      ] of deleteElementariesList.entries()) {
        const deleteConsumedElementaryData = {
          courseMealId: originalCourseMealId,
          foodElementaryId: elementaryToDeleteId,
          isInvalidationNeeded:
            index == deleteElementariesList.length - 1 &&
            deleteRecipesList.length +
              changeElementariesList.length +
              changeRecipesList.length +
              addElementariesList.length +
              addRecipesList.length ==
              0
              ? true
              : false,
        };

        await doDeleteConsumedElementary(deleteConsumedElementaryData)
          .unwrap()
          .catch((error) => {
            handleApiCallError({
              error: error,
              dispatch: dispatch,
              navigate: navigate,
            });
          });
      }

      // Delete Consumed Recipes
      for (const [index, recipeToDeleteId] of deleteRecipesList.entries()) {
        const deleteConsumedRecipeData = {
          courseMealId: originalCourseMealId,
          foodRecipeId: recipeToDeleteId,
          isInvalidationNeeded:
            index == deleteRecipesList.length - 1 &&
            changeElementariesList.length +
              changeRecipesList.length +
              addElementariesList.length +
              addRecipesList.length ==
              0
              ? true
              : false,
        };

        await doDeleteConsumedRecipe(deleteConsumedRecipeData)
          .unwrap()
          .catch((error) => {
            handleApiCallError({
              error: error,
              dispatch: dispatch,
              navigate: navigate,
            });
          });
      }

      // Change Consumed Elementaries Weight
      for (const [
        index,
        originalElementary,
      ] of changeElementariesList.entries()) {
        const changeConsumedElementaryWeightData = {
          courseMealId: originalCourseMealId,
          foodElementaryId: originalElementary.foodElementaryId,
          data: {
            weight: originalElementary.weight,
          },
          isInvalidationNeeded:
            index == changeElementariesList.length - 1 &&
            changeRecipesList.length +
              addElementariesList.length +
              addRecipesList.length ==
              0
              ? true
              : false,
        };

        await doChangeConsumedElementaryWeight(
          changeConsumedElementaryWeightData
        )
          .unwrap()
          .catch((error) => {
            handleApiCallError({
              error: error,
              dispatch: dispatch,
              navigate: navigate,
            });
          });
      }

      // Change Consumed Recipes Weight
      for (const [index, originalRecipe] of changeRecipesList.entries()) {
        const changeConsumedRecipeWeightData = {
          courseMealId: originalCourseMealId,
          foodRecipeId: originalRecipe.foodRecipeId,
          data: {
            weight: originalRecipe.weight,
          },
          isInvalidationNeeded:
            index == changeRecipesList.length - 1 &&
            addElementariesList.length + addRecipesList.length == 0
              ? true
              : false,
        };

        await doChangeConsumedRecipeWeight(changeConsumedRecipeWeightData)
          .unwrap()
          .catch((error) => {
            handleApiCallError({
              error: error,
              dispatch: dispatch,
              navigate: navigate,
            });
          });
      }

      // Add New Consumed Elementaries
      for (const [index, foodElementary] of addElementariesList.entries()) {
        const addFoodElementaryData = {
          id: originalCourseMealId,
          data: {
            foodElementaryId: foodElementary.foodElementaryId,
            weight: foodElementary.weight,
          },
          isInvalidationNeeded:
            index == addElementariesList.length - 1 &&
            addRecipesList.length == 0
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
      for (const [index, foodRecipe] of addRecipesList.entries()) {
        const addFoodRecipeData = {
          id: originalCourseMealId,
          data: {
            foodRecipeId: foodRecipe.foodRecipeId,
            weight: foodRecipe.weight,
          },
          isInvalidationNeeded:
            index == addRecipesList.length - 1 ? true : false,
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
    }

    setMainIsLoading(false);
    reset();
    setIsEditMode(!isEditMode);
  };

  const handleOnSelectInputChange = () => {
    trigger();
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

  useEffect(() => {
    const originalElementaries = originalConsumedElementaries.map(
      (elementary: IConsumedElementary) => {
        return {
          foodElementaryId: {
            label: elementary.foodElementary.name,
            value: elementary.foodElementary.id,
          },
          weight: elementary.elementaryInMealWeight.toString(),
        };
      }
    );

    originalElementaries.forEach((originalElementary) => {
      originalElementaryAppend(originalElementary);
      foodForbiddenToAddIdsRef.current.push(
        originalElementary.foodElementaryId.value
      );
    });

    const originalRecipes = originalConsumedRecipes.map(
      (recipe: IConsumedRecipe) => {
        return {
          foodRecipeId: {
            label: recipe.foodRecipe.name,
            value: recipe.foodRecipe.id,
          },
          weight: recipe.recipeInMealWeight.toString(),
        };
      }
    );

    originalRecipes.forEach((originalRecipe) => {
      originalRecipeAppend(originalRecipe);
      foodForbiddenToAddIdsRef.current.push(originalRecipe.foodRecipeId.value);
    });

    loadSelectFoodOptions();
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
      setSelectedMealTypeOption(
        selectOptions.find((item) => item.value == originalMealTypeId)
      );
    }
  }, [dataGetAllMealTypes]);

  const isDeleteButtonDisabled =
    originalElementaryFields.length +
      originalRecipeFields.length +
      addFoodListFields.length <
    2
      ? true
      : false;

  return (
    <div className="w-full max-w-5xl flex flex-col justify-center items-start">
      <form
        className="flex flex-col flex-wrap justify-center w-full"
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
                  id={"FoodRecipeEditForm_creationTime"}
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
              {originalElementaryFields.map((item, index) => {
                return (
                  <DisabledSelectRowWithWeightField
                    key={`MealEditForm_div_originalElementaryFields_${item.id}_${index}`}
                    itemId={item.id}
                    itemIndex={index}
                    label={"Блюдо"}
                    selectPlaceholder={"Название..."}
                    handleRemoveItem={handleRemoveOriginalElementary}
                    controllerName={
                      `originalFoodElementaryList.${index}.foodElementaryId` as const
                    }
                    control={control}
                    register={{
                      ...register(
                        `originalFoodElementaryList.${index}.weight` as const
                      ),
                    }}
                    isDeleteButtonDisabled={isDeleteButtonDisabled}
                    hasErrors={!!errors?.originalFoodElementaryList}
                    errorMessagesList={
                      [
                        errors?.originalFoodElementaryList?.[index]
                          ?.foodElementaryId?.value?.message,
                        errors?.originalFoodElementaryList?.[index]?.weight
                          ?.message,
                      ].filter((item) => !!item) as string[]
                    }
                  />
                );
              })}

              {originalRecipeFields.map((item, index) => {
                return (
                  <DisabledSelectRowWithWeightField
                    key={`MealEditForm_div_originalRecipeFields_${item.id}_${index}`}
                    itemId={item.id}
                    itemIndex={index}
                    label={"Блюдо"}
                    selectPlaceholder={"Название..."}
                    handleRemoveItem={handleRemoveOriginalRecipe}
                    controllerName={
                      `originalFoodRecipeList.${index}.foodRecipeId` as const
                    }
                    control={control}
                    register={{
                      ...register(
                        `originalFoodRecipeList.${index}.weight` as const
                      ),
                    }}
                    isDeleteButtonDisabled={isDeleteButtonDisabled}
                    hasErrors={!!errors?.originalFoodRecipeList}
                    errorMessagesList={
                      [
                        errors?.originalFoodRecipeList?.[index]?.foodRecipeId
                          ?.value?.message,
                        errors?.originalFoodRecipeList?.[index]?.weight
                          ?.message,
                      ].filter((item) => !!item) as string[]
                    }
                  />
                );
              })}

              {addFoodListFields.map((item, index) => {
                return (
                  <SelectRowWithWeightField
                    key={`MealEditForm_Div_addFoodList_${item.id}_${index}`}
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
                    isDeleteButtonDisabled={isDeleteButtonDisabled}
                    hasErrors={!!errors?.addFoodList}
                    errorMessagesList={
                      [
                        errors?.addFoodList?.[index]?.foodInfo?.value?.message,
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
                  onClick={() => {
                    newFoodForbiddenToAddIdsRef.current.push("");

                    addFoodListAppend({
                      weight: "0",
                    });
                  }}
                  className="p-[12px]"
                  isDisabled={isValid ? false : true}
                />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap w-full gap-x-4 gap-y-3 justify-stretch items-center">
              <span className="flex-grow">
                <ButtonIlluminated
                  children={"Сохранить"}
                  type="submit"
                  isDisabled={isValid ? false : true}
                />
              </span>
              <span className="flex-grow">
                <ButtonIlluminated
                  children={"Отменить"}
                  type="button"
                  onClick={() => {
                    setIsEditMode(!isEditMode);
                  }}
                  buttonVariant={"light"}
                />
              </span>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default MealEditForm;
