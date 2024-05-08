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

const MealEditForm: FC<TProps> = ({
  courseMealId,
  originalMealTypeId,
  consumedElementaries,
  consumedRecipes,
  setIsEditMode,
}) => {
  const deleteIconPlayerRef = useRef<Player>(null);
  const ICON_SIZE = 28;

  const [selectedMealType, setSelectedMealType] = useState(originalMealTypeId);

  // Elementaries to delete
  const originalElementariesToRemoveIdsRef = useRef(new Array());
  // Recipes to delete
  const originalRecipesToRemoveIdsRef = useRef(new Array());

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

  // Add new Food Elementary
  const {
    isLoading: isLoadingGetAllFoodElementary,
    data: dataGetAllFoodElementary,
    error: errorGetAllFoodElementary,
  } = useGetAllFoodElementaryQuery(undefined);

  // Add new Food Recipe
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

    const filteredOptions = filteredElementaryOptions.concat(
      filteredRecipeOptions
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

  const {
    fields: originalElementaryFields,
    append: originalElementaryAppend,
    remove: originalElementaryRemove,
  } = useFieldArray({
    name: "originalFoodElementaryList",
    control,
  });

  const {
    fields: addFoodFields,
    append: addFoodAppend,
    remove: addFoodRemove,
  } = useFieldArray({
    name: "addFoodList",
    control,
  });

  const handleRemoveOriginalElementary = (itemIndex: number) => {
    originalElementariesToRemoveIdsRef.current.push(
      getValues(
        `originalFoodElementaryList.${itemIndex}.foodElementaryId.value`
      )
    );

    originalElementaryRemove(itemIndex);
  };

  const {
    fields: originalRecipeFields,
    append: originalRecipeAppend,
    remove: originalRecipeRemove,
  } = useFieldArray({
    name: "originalFoodRecipeList",
    control,
  });

  const handleRemoveOriginalRecipe = (itemIndex: number) => {
    originalRecipesToRemoveIdsRef.current.push(
      getValues(`originalFoodRecipeList.${itemIndex}.foodRecipeId.value`)
    );

    originalRecipeRemove(itemIndex);
  };

  const onSubmit: SubmitHandler<TMealEditFormData> = async (data) => {
    // Elementaries Data
    console.log("addFoodList");
    console.log(data?.addFoodList);

    const addElementaryList = data?.addFoodList
      ?.filter((item) => item.foodInfo?.isElementary === true)
      .map((item) => {
        return {
          foodElementaryId: item?.foodInfo?.value,
          weight: item?.weight,
        };
      });

    const originalElementaryList = data?.originalFoodElementaryList?.map(
      (item) => {
        return {
          foodElementaryId: item?.foodElementaryId?.value,
          weight: item?.weight,
        };
      }
    );

    const elementariesIdsToDelete = originalElementariesToRemoveIdsRef.current;

    // Recipes Data
    const addRecipeList = data?.addFoodList
      ?.filter((item) => item.foodInfo?.isElementary === false)
      .map((item) => {
        return {
          foodRecipeId: item?.foodInfo?.value,
          weight: item?.weight,
        };
      });

    const originalRecipeList = data?.originalFoodRecipeList?.map((item) => {
      return {
        foodRecipeId: item?.foodRecipeId?.value,
        weight: item?.weight,
      };
    });

    const recipesIdsToDelete = originalRecipesToRemoveIdsRef.current;

    // Change Meal Type
    const mealType = selectedMealType;

    const changeMealTypeData = {
      courseMealId: courseMealId,
      data: {
        mealTypeId: mealType,
      },
    };

    doChangeMealType(changeMealTypeData).catch((e) => console.log(e));

    // Change Consumed Elementaries Weight
    for (const originalElementary of originalElementaryList) {
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
    }

    // Change Consumed Recipes Weight
    for (const originalRecipe of originalRecipeList) {
      const changeConsumedRecipeWeightData = {
        courseMealId: courseMealId,
        foodRecipeId: originalRecipe.foodRecipeId,
        data: {
          weight: originalRecipe.weight,
        },
      };

      doChangeConsumedRecipeWeight(changeConsumedRecipeWeightData).catch((e) =>
        console.log(e)
      );
    }

    // Add New Consumed Elementaries
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
    }

    // Add New Consumed Recipes
    for (const foodRecipe of addRecipeList) {
      const addFoodRecipeData = {
        id: courseMealId,
        data: {
          foodRecipeId: foodRecipe.foodRecipeId,
          weight: foodRecipe.weight,
        },
      };

      doAddConsumedRecipe(addFoodRecipeData).catch((e) => console.log(e));
    }

    // Delete Consumed Elementaries
    for (const elementaryToDeleteId of elementariesIdsToDelete) {
      const deleteConsumedElementaryData = {
        courseMealId: courseMealId,
        foodElementaryId: elementaryToDeleteId,
      };

      doDeleteConsumedElementary(deleteConsumedElementaryData).catch((e) =>
        console.log(e)
      );
    }

    // Delete Consumed Recipes
    for (const recipeToDeleteId of recipesIdsToDelete) {
      const deleteConsumedRecipeData = {
        courseMealId: courseMealId,
        foodRecipeId: recipeToDeleteId,
      };

      doDeleteConsumedRecipe(deleteConsumedRecipeData).catch((e) =>
        console.log(e)
      );
    }

    reset();

    setIsEditMode(false);
  };

  const handleOptionChange = () => {
    trigger();
  };

  // TODO: CHANGE
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
    });
  }, []);

  return (
    <form
      className="flex flex-col flex-wrap justify-center w-full px-7 pt-5 pb-8"
      onSubmit={handleSubmit(onSubmit)}
    >
      <MealTypeOptions
        selectedMealType={selectedMealType}
        setSelectedMealType={setSelectedMealType}
      />

      <div className="flex flex-col">
        <h3 className="text-xl my-3">Блюда:</h3>

        {originalElementaryFields.map((field, index) => {
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
                      `originalFoodElementaryList.${index}.foodElementaryId` as const
                    }
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        key={index}
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

        {originalRecipeFields.map((field, index) => {
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
                      `originalFoodRecipeList.${index}.foodRecipeId` as const
                    }
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        key={index}
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

        {addFoodFields.map((field, index) => {
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
                    name={`addFoodList.${index}.foodInfo` as const}
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
                    id={`addFoodList.${index}.weight`}
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
                      addFoodRemove(index);
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
              addFoodAppend({
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
