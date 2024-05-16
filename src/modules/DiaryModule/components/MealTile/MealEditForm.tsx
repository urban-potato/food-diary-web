import { FC, useEffect, useRef, useState } from "react";
import {
  editValidationSchema,
  selectMealTypeStyles,
  selectStyles,
} from "../../constants/constants";
import {
  useAddConsumedElementaryMutation,
  useChangeConsumedElementaryWeightMutation,
  useDeleteConsumedElementaryMutation,
  useChangeMealTypeMutation,
  useAddConsumedRecipeMutation,
  useChangeConsumedRecipeWeightMutation,
  useDeleteConsumedRecipeMutation,
} from "../../api/meals.api";
import { useGetAllFoodElementaryQuery } from "../../../FoodElementaryModule";
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import AsyncSelect from "react-select/async";
import NoOptionsMessage from "../../../../components/NoOptionsMessage/NoOptionsMessage";
import InputIlluminated from "../../../../ui/InputIlluminated/InputIlluminated";
import ButtonIlluminated from "../../../../ui/ButtonIlluminated/ButtonIlluminated";
import { Player } from "@lordicon/react";
import DELETE_ICON from "../../../../global/assets/system-regular-39-trash.json";
import Select from "react-select";
import { useGetAllFoodRecipeQuery } from "../../../FoodRecipeModule/api/foodRecipe.api";
import {
  IConsumedElementary,
  IConsumedRecipe,
  IFoodElementary,
  IFoodRecipe,
  IMealType,
} from "../../../../global/types/types";
import { useGetAllMealTypesQuery } from "../../api/mealTypes.api";
import Preloader from "../../../../components/Preloader/Preloader";
import DisabledSelectRowWithWeightField from "../../../../components/DisabledSelectRowWithWeightField/DisabledSelectRowWithWeightField";
import AsyncSelectRowWithWeightField from "../../../../components/AsyncSelectRowWithWeightField/AsyncSelectRowWithWeightField";

type TProps = {
  courseMealId: string;
  originalMealTypeId: string;
  consumedElementaries: IConsumedElementary[];
  consumedRecipes: IConsumedRecipe[];
  setIsEditMode: Function;
};

type TMealEditFormData = {
  addFoodList: {
    foodInfo?: {
      label?: string | undefined;
      value: string;
      isElementary: boolean;
    };
    weight: number;
  }[];
  originalFoodElementaryList: {
    foodElementaryId: {
      label: string;
      value: string;
    };
    weight: number;
  }[];
  originalFoodRecipeList: {
    foodRecipeId: {
      label: string;
      value: string;
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

const MealEditForm: FC<TProps> = ({
  courseMealId,
  originalMealTypeId,
  consumedElementaries,
  consumedRecipes,
  setIsEditMode,
}) => {
  const [mealTypeOptions, setMealTypeOptions] = useState<Array<TSelectOption>>(
    new Array()
  );
  const [selectedMealTypeOption, setSelectedMealTypeOption] = useState<
    TSelectOption | null | undefined
  >(null);

  const foodForbiddenToAddIdsRef = useRef<Array<String>>(new Array());
  const newFoodForbiddenToAddIdsRef = useRef<Array<String>>(new Array());

  const deleteIconPlayerRef = useRef<Player>(null);
  const ICON_SIZE = 28;

  // const [selectedMealTypeId, setSelectedMealTypeId] =
  //   useState(originalMealTypeId);

  // Elementaries to delete
  const originalElementariesToRemoveIdsRef = useRef<Array<String>>(new Array());
  // Recipes to delete
  const originalRecipesToRemoveIdsRef = useRef<Array<String>>(new Array());

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
    error: errorGetAllMealTypes,
    isSuccess: isSuccessGetAllMealTypes,
  } = useGetAllMealTypesQuery(undefined);

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
        (item) =>
          !foodForbiddenToAddIdsRef.current.includes(item.value) &&
          !newFoodForbiddenToAddIdsRef.current.includes(item.value)
      );

    callback(filteredOptions);
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
  } = useForm<TMealEditFormData>({
    resolver: yupResolver(editValidationSchema),
    mode: "onChange",
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
  };

  const handleRemoveFoodToAdd = (itemIndex: number) => {
    if (
      itemIndex > -1 &&
      itemIndex < newFoodForbiddenToAddIdsRef.current.length
    ) {
      newFoodForbiddenToAddIdsRef.current.splice(itemIndex, 1);
    }

    addFoodListRemove(itemIndex);
  };

  const onSubmit: SubmitHandler<TMealEditFormData> = async (data) => {
    // Delete Consumed Elementaries
    const elementariesIdsToDelete = originalElementariesToRemoveIdsRef.current;

    for (const elementaryToDeleteId of elementariesIdsToDelete) {
      const deleteConsumedElementaryData = {
        courseMealId: courseMealId,
        foodElementaryId: elementaryToDeleteId,
      };

      await doDeleteConsumedElementary(deleteConsumedElementaryData).catch(
        (e) => console.log(e)
      );

      console.log("Delete Consumed Elementaries");
    }

    // Delete Consumed Recipes
    const recipesIdsToDelete = originalRecipesToRemoveIdsRef.current;

    for (const recipeToDeleteId of recipesIdsToDelete) {
      const deleteConsumedRecipeData = {
        courseMealId: courseMealId,
        foodRecipeId: recipeToDeleteId,
      };

      await doDeleteConsumedRecipe(deleteConsumedRecipeData).catch((e) =>
        console.log(e)
      );

      console.log("Delete Consumed Recipes");
    }

    // Change Meal Type
    const mealType = selectedMealTypeOption?.value;
    if (mealType != originalMealTypeId) {
      const changeMealTypeData = {
        courseMealId: courseMealId,
        data: {
          mealTypeId: mealType,
        },
      };

      await doChangeMealType(changeMealTypeData).catch((e) => console.log(e));

      console.log("Change Meal Type");
    }

    // Change Consumed Elementaries Weight
    const originalElementaryList = data?.originalFoodElementaryList?.map(
      (item) => {
        return {
          foodElementaryId: item?.foodElementaryId?.value,
          weight: item?.weight,
        };
      }
    );

    const consumedElementariesWithoutDeleted = consumedElementaries.filter(
      (item) => !elementariesIdsToDelete.includes(item.foodElementary.id)
    );

    for (const originalElementary of originalElementaryList) {
      const consumedElementaryToChange =
        consumedElementariesWithoutDeleted.find(
          (item) =>
            item.foodElementary.id == originalElementary.foodElementaryId
        );

      if (
        consumedElementaryToChange != undefined &&
        consumedElementaryToChange.elementaryInMealWeight !=
          originalElementary.weight
      ) {
        const changeConsumedElementaryWeightData = {
          courseMealId: courseMealId,
          foodElementaryId: originalElementary.foodElementaryId,
          data: {
            weight: originalElementary.weight,
          },
        };

        await doChangeConsumedElementaryWeight(
          changeConsumedElementaryWeightData
        ).catch((e) => console.log(e));

        console.log("Change Consumed Elementaries Weight");
      }
    }

    // Change Consumed Recipes Weight
    const originalRecipeList = data?.originalFoodRecipeList?.map((item) => {
      return {
        foodRecipeId: item?.foodRecipeId?.value,
        weight: item?.weight,
      };
    });

    const consumedRecipesWithoutDeleted = consumedRecipes.filter(
      (item) => !recipesIdsToDelete.includes(item.foodRecipe.id)
    );

    for (const originalRecipe of originalRecipeList) {
      const consumedRecipeToChange = consumedRecipesWithoutDeleted.find(
        (item) => item.foodRecipe.id == originalRecipe.foodRecipeId
      );

      if (
        consumedRecipeToChange != undefined &&
        consumedRecipeToChange.recipeInMealWeight != originalRecipe.weight
      ) {
        const changeConsumedRecipeWeightData = {
          courseMealId: courseMealId,
          foodRecipeId: originalRecipe.foodRecipeId,
          data: {
            weight: originalRecipe.weight,
          },
        };

        await doChangeConsumedRecipeWeight(
          changeConsumedRecipeWeightData
        ).catch((e) => console.log(e));

        console.log("Change Consumed Recipes Weight");
      }
    }

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

    setIsEditMode(false);
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

    const isAllFoodListsEmply =
      !getValues("addFoodList")?.length &&
      !getValues("originalFoodElementaryList")?.length &&
      !getValues("originalFoodRecipeList")?.length;

    let addFoodWeightErrors = errors?.addFoodList;
    let originalElementariesWeightErrors = errors?.originalFoodElementaryList;
    let originalRecipesWeightErrors = errors?.originalFoodRecipeList;

    let result =
      !emptyMeals &&
      !addFoodWeightErrors &&
      !originalElementariesWeightErrors &&
      !originalRecipesWeightErrors &&
      !isAllFoodListsEmply
        ? true
        : false;

    return result;
  };

  useEffect(() => {
    const originalElementaries = consumedElementaries.map(
      (elementary: IConsumedElementary) => {
        return {
          foodElementaryId: {
            label: elementary.foodElementary.name,
            value: elementary.foodElementary.id,
          },
          weight: elementary.elementaryInMealWeight,
        };
      }
    );

    originalElementaries.forEach((originalElementary) => {
      originalElementaryAppend(originalElementary);
      foodForbiddenToAddIdsRef.current.push(
        originalElementary.foodElementaryId.value
      );
    });

    const originalRecipes = consumedRecipes.map((recipe: IConsumedRecipe) => {
      return {
        foodRecipeId: {
          label: recipe.foodRecipe.name,
          value: recipe.foodRecipe.id,
        },
        weight: recipe.recipeInMealWeight,
      };
    });

    originalRecipes.forEach((originalRecipe) => {
      originalRecipeAppend(originalRecipe);
      foodForbiddenToAddIdsRef.current.push(originalRecipe.foodRecipeId.value);
    });
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

      const selectOptions: TSelectOption[] = [];

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

  return (
    <div className="w-full max-w-5xl flex flex-col justify-center items-start">
      <form
        className="flex flex-col flex-wrap justify-center w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        {isLoadingGetAllMealTypes ? (
          <div className="flex justify-center items-center">
            <Preloader />
          </div>
        ) : (
          <>
            <div className="w-full flex-grow flex justify-center items-end gap-y-1 gap-x-3 mb-5 -mt-5">
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
              {originalElementaryFields.map((item, index) => {
                return (
                  <DisabledSelectRowWithWeightField
                    key={`MealEditForm_div_originalElementaryFields_${item.id}_${index}`}
                    itemId={item.id}
                    itemIndex={index}
                    label={"Блюдо"}
                    selectPlaceholder={"Введите название блюда"}
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
                    errors={errors}
                    errorsGroup={errors.originalFoodElementaryList}
                    errorSelect={
                      errors.originalFoodElementaryList?.[index]
                        ?.foodElementaryId?.value
                    }
                    errorFeild={
                      errors.originalFoodElementaryList?.[index]?.weight
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
                    selectPlaceholder={"Введите название блюда"}
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
                    errors={errors}
                    errorsGroup={errors.originalFoodRecipeList}
                    errorSelect={
                      errors.originalFoodRecipeList?.[index]?.foodRecipeId
                        ?.value
                    }
                    errorFeild={errors.originalFoodRecipeList?.[index]?.weight}
                  />
                );
              })}

              {addFoodListFields.map((item, index) => {
                return (
                  <AsyncSelectRowWithWeightField
                    key={`MealEditForm_Div_addFoodList_${item.id}_${index}`}
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
                  buttonPadding=" p-[12px] "
                  additionalStyles=""
                  isIttuminationDisabled={true}
                />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap w-full gap-x-4 gap-y-3 justify-stretch items-center">
              <span className="flex-grow">
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
              </span>
              <span className="flex-grow">
                <ButtonIlluminated
                  label="Отменить"
                  isDarkButton={false}
                  isIlluminationFull={false}
                  onClick={() => {
                    setIsEditMode(false);
                  }}
                  isIttuminationDisabled={true}
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
