import { FC, useEffect, useRef, useState } from "react";
import MealTypeOptions from "./MealTypeOptions";
import { editValidationSchema, selectStyles } from "../constants/constants";
import {
  useAddConsumedElementaryMutation,
  useChangeConsumedElementaryWeightMutation,
  useDeleteConsumedElementaryMutation,
  useChangeMealTypeMutation,
  useAddConsumedRecipeMutation,
  useChangeConsumedRecipeWeightMutation,
  useDeleteConsumedRecipeMutation,
  useGetAllFoodRecipeQuery,
} from "../api/meals.api";
import {
  IFoodElementary,
  useGetAllFoodElementaryQuery,
} from "../../FoodElementaryModule";
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import {
  IConsumedElementary,
  IConsumedRecipe,
  IFoodRecipe,
} from "../types/types";
import { yupResolver } from "@hookform/resolvers/yup";
import AsyncSelect from "react-select/async";
import NoOptionsMessage from "../../../components/NoOptionsMessage/NoOptionsMessage";
import InputIlluminated from "../../../ui/InputIlluminated/InputIlluminated";
import ButtonIlluminated from "../../../ui/ButtonIlluminated/ButtonIlluminated";
import { Player } from "@lordicon/react";
import DELETE_ICON from "../../../global/assets/system-regular-39-trash.json";
import Select from "react-select";

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

const MealEditForm: FC<TProps> = ({
  courseMealId,
  originalMealTypeId,
  consumedElementaries,
  consumedRecipes,
  setIsEditMode,
}) => {
  const foodForbiddenToAddIdsRef = useRef<Array<String>>(new Array());
  const newFoodForbiddenToAddIdsRef = useRef<Array<String>>(new Array());

  const deleteIconPlayerRef = useRef<Player>(null);
  const ICON_SIZE = 28;

  const [selectedMealTypeId, setSelectedMealTypeId] =
    useState(originalMealTypeId);

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

      doDeleteConsumedElementary(deleteConsumedElementaryData).catch((e) =>
        console.log(e)
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

      doDeleteConsumedRecipe(deleteConsumedRecipeData).catch((e) =>
        console.log(e)
      );

      console.log("Delete Consumed Recipes");
    }

    // Change Meal Type
    if (selectedMealTypeId != originalMealTypeId) {
      const changeMealTypeData = {
        courseMealId: courseMealId,
        data: {
          mealTypeId: selectedMealTypeId,
        },
      };

      doChangeMealType(changeMealTypeData).catch((e) => console.log(e));

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

    for (const originalElementary of originalElementaryList) {
      const consumedElementariesWithoutDeleted = consumedElementaries.filter(
        (item) => !elementariesIdsToDelete.includes(item.foodElementary.id)
      );

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

        doChangeConsumedElementaryWeight(
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

    for (const originalRecipe of originalRecipeList) {
      const consumedRecipesWithoutDeleted = consumedRecipes.filter(
        (item) => !recipesIdsToDelete.includes(item.foodRecipe.id)
      );

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

        doChangeConsumedRecipeWeight(changeConsumedRecipeWeightData).catch(
          (e) => console.log(e)
        );

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

      doAddConsumedElementary(addFoodElementaryData).catch((e) =>
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

      doAddConsumedRecipe(addFoodRecipeData).catch((e) => console.log(e));

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

  return (
    <form
      className="flex flex-col flex-wrap justify-center w-full px-7 pt-5 pb-8"
      onSubmit={handleSubmit(onSubmit)}
    >
      <MealTypeOptions
        selectedMealTypeId={selectedMealTypeId}
        setSelectedMealTypeId={setSelectedMealTypeId}
      />

      <div className="flex flex-col">
        <h3 className="text-xl my-3">Блюда:</h3>

        {originalElementaryFields.map((select, index) => {
          return (
            <div
              key={`MealEditForm_div_originalElementaryFields_${select.id}_${index}`}
              className="form-control flex flex-col"
            >
              <div className="gap-x-3 flex mb-1">
                <div className="flex flex-col justify-center gap-3 flex-grow mb-3">
                  <span className="flex gap-x-1">
                    <h3>Блюдо</h3>
                    <p className="text-red">*</p>
                  </span>
                  <Controller
                    key={`MealEditForm_controller_originalElementaryFields_${select.id}_${index}`}
                    name={
                      `originalFoodElementaryList.${index}.foodElementaryId` as const
                    }
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        key={`MealEditForm_select_originalElementaryFields_${select.id}_${index}`}
                        className="relative text-sm rounded-xl  "
                        styles={selectStyles}
                        isDisabled={true}
                      />
                    )}
                  />
                </div>

                <div className="-mt-4 sm:max-w-[100px] max-w-[80px] flex-grow">
                  <InputIlluminated
                    id={`originalFoodElementaryList.${index}.weight`}
                    type="number"
                    placeholder="Вес (г)"
                    disableIllumination={true}
                    additionalStyles=" h-[67px] border-0 "
                    register={{
                      ...register(
                        `originalFoodElementaryList.${index}.weight` as const
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
                      handleRemoveOriginalElementary(index);
                    }}
                    buttonPadding=" p-[14px] "
                    additionalStyles=" "
                  />
                </div>
              </div>

              {errors.originalFoodElementaryList && (
                <div
                  className={
                    Object.keys(errors).length > 0 &&
                    errors.originalFoodElementaryList[index]
                      ? "flex flex-col mb-2 px-5 gap-y-2 justify-center"
                      : "hidden"
                  }
                >
                  <p
                    className={
                      errors.originalFoodElementaryList[index]?.foodElementaryId
                        ?.value
                        ? "text-pink-500 "
                        : " hidden "
                    }
                  >
                    {
                      errors.originalFoodElementaryList[index]?.foodElementaryId
                        ?.value?.message
                    }
                  </p>
                  <p
                    className={
                      errors.originalFoodElementaryList[index]?.weight
                        ? "text-pink-500 "
                        : " hidden "
                    }
                  >
                    {errors.originalFoodElementaryList[index]?.weight?.message}
                  </p>
                </div>
              )}
            </div>
          );
        })}

        {originalRecipeFields.map((select, index) => {
          return (
            <div
              key={`MealEditForm_div_originalRecipeFields_${select.id}_${index}`}
              className="form-control flex flex-col"
            >
              <div className="gap-x-3 flex mb-1">
                <div className="flex flex-col justify-center gap-3 flex-grow mb-3">
                  <span className="flex gap-x-1">
                    <h3>Блюдо</h3>
                    <p className="text-red">*</p>
                  </span>
                  <Controller
                    key={`MealEditForm_controller_originalRecipeFields_${select.id}_${index}`}
                    name={
                      `originalFoodRecipeList.${index}.foodRecipeId` as const
                    }
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        key={`MealEditForm_select_originalRecipeFields_${select.id}_${index}`}
                        className="relative text-sm rounded-xl  "
                        styles={selectStyles}
                        isDisabled={true}
                      />
                    )}
                  />
                </div>

                <div className="-mt-4 sm:max-w-[100px] max-w-[80px] flex-grow">
                  <InputIlluminated
                    id={`originalFoodRecipeList.${index}.weight`}
                    type="number"
                    placeholder="Вес (г)"
                    disableIllumination={true}
                    additionalStyles=" h-[67px] border-0 "
                    register={{
                      ...register(
                        `originalFoodRecipeList.${index}.weight` as const
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
                      handleRemoveOriginalRecipe(index);
                    }}
                    buttonPadding=" p-[14px] "
                    additionalStyles=" "
                  />
                </div>
              </div>

              {errors.originalFoodRecipeList && (
                <div
                  className={
                    Object.keys(errors).length > 0 &&
                    errors.originalFoodRecipeList[index]
                      ? "flex flex-col mb-2 px-5 gap-y-2 justify-center"
                      : "hidden"
                  }
                >
                  <p
                    className={
                      errors.originalFoodRecipeList[index]?.foodRecipeId?.value
                        ? "text-pink-500 "
                        : " hidden "
                    }
                  >
                    {
                      errors.originalFoodRecipeList[index]?.foodRecipeId?.value
                        ?.message
                    }
                  </p>
                  <p
                    className={
                      errors.originalFoodRecipeList[index]?.weight
                        ? "text-pink-500 "
                        : " hidden "
                    }
                  >
                    {errors.originalFoodRecipeList[index]?.weight?.message}
                  </p>
                </div>
              )}
            </div>
          );
        })}

        {addFoodListFields.map((select, index) => {
          return (
            <div
              key={`MealEditForm_Div_addFoodList_${select.id}_${index}`}
              className="form-control flex flex-col"
            >
              <div className="gap-x-3 flex mb-1">
                <div className="flex flex-col justify-center gap-3 flex-grow mb-3">
                  <span className="flex gap-x-1">
                    <h3>Блюдо</h3>
                    <p className="text-red">*</p>
                  </span>
                  <Controller
                    key={`MealEditForm_Controller_addFoodList_${select.id}_${index}`}
                    name={`addFoodList.${index}.foodInfo` as const}
                    control={control}
                    render={({ field }) => (
                      <AsyncSelect
                        {...field}
                        key={`MealEditForm_AsyncSelect_addFoodList_${select.id}_${index}`}
                        className="relative text-sm rounded-xl  "
                        components={{ NoOptionsMessage }}
                        styles={selectStyles}
                        placeholder="Введите название блюда"
                        loadOptions={loadOptions}
                        onInputChange={handleOnInputChange}
                        onChange={(newValue) => {
                          handleOnChange(newValue as TSelectElement, index);
                          field.onChange(newValue);
                        }}
                      />
                    )}
                  />
                </div>

                <div className="-mt-4 sm:max-w-[100px] max-w-[80px] flex-grow">
                  <InputIlluminated
                    id={`MealEditForm_addFoodList.${index}.weight`}
                    type="number"
                    placeholder="Вес (г)"
                    disableIllumination={true}
                    additionalStyles=" h-[67px] border-0 "
                    register={{
                      ...register(`addFoodList.${index}.weight` as const),
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
                  />
                </div>
              </div>

              {errors.addFoodList && (
                <div
                  className={
                    Object.keys(errors).length > 0 && errors.addFoodList[index]
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
                    {errors.addFoodList[index]?.foodInfo?.value?.message}
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

      <div className="mt-9 flex flex-wrap w-full gap-x-4 gap-y-3 justify-stretch items-center">
        <span className="flex-grow">
          <ButtonIlluminated
            label="Сохранить"
            isDarkButton={true}
            isIlluminationFull={false}
            isButton={true}
            type="submit"
            additionalStyles=""
            isDisabled={checkIfFilledRight() ? false : true}
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
            buttonPadding=" p-4 "
          />
        </span>
      </div>
    </form>
  );
};

export default MealEditForm;
