import { FC, useEffect, useRef, useState } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import {
  IFoodElementary,
  IIngredient,
} from "../../../../global/types/entities-types";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  useAddElementaryMutation,
  useChangeElementaryWeightMutation,
  useChangeFoodRecipeNameMutation,
  useDeleteElementaryMutation,
} from "../../api/food-recipe.api";
import { useGetAllFoodElementaryQuery } from "../../../FoodElementaryModule";
import { editFoodRecipeValidationSchema } from "../../constants/FoodRecipeModule.constants";
import InputIlluminated from "../../../../ui/InputIlluminated/InputIlluminated";
import ButtonIlluminated from "../../../../ui/ButtonIlluminated/ButtonIlluminated";
import DisabledSelectRowWithWeightField from "../../../../components/DisabledSelectRowWithWeightField/DisabledSelectRowWithWeightField";
import { useAppDispatch } from "../../../../global/store/store-hooks";
import { useNavigate } from "react-router-dom";
import { handleApiCallError } from "../../../../global/helpers/handle-api-call-error.helper";
import Preloader from "../../../../components/Preloader/Preloader";
import { compareLabels } from "../../../../global/helpers/compare-labels.helper";
import { ROUTES_LIST } from "../../../../global/constants/constants";
import SelectRowWithWeightField from "../../../../components/SelectRowWithWeightField/SelectRowWithWeightField";

type TProps = {
  foodRecipeId: string;
  originalFoodRecipeName: string;
  ingredients: IIngredient[];
  setIsEditMode: Function;
  isEditMode: boolean;
  setMainIsLoading: Function;
};

type TFoodRecipeEditFormData = {
  foodRecipeName: string;
  addIngredientsList: {
    ingredientInfo?: {
      label?: string | undefined;
      value: string;
    };
    weight: string;
  }[];
  originalIngredientsList: {
    ingredientInfo: {
      label: string;
      value: string;
    };
    weight: string;
  }[];
};

type TSelectElement = {
  label: string;
  value: string;
};

const FoodRecipeEditForm: FC<TProps> = ({
  foodRecipeId,
  originalFoodRecipeName,
  ingredients,
  setIsEditMode,
  isEditMode,
  setMainIsLoading,
}) => {
  const [selectIngredientsOptions, setSelectIngredientsOptions] = useState<
    Array<TSelectElement>
  >(new Array());

  const ingredientsForbiddenToAddIdsRef = useRef<Array<String>>(new Array());
  const newIngredientsForbiddenToAddIdsRef = useRef<Array<String>>(new Array());

  // Ingredients to delete
  const originalIngredientsToRemoveIdsRef = useRef<Array<String>>(new Array());

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [doChangeFoodRecipeName] = useChangeFoodRecipeNameMutation();

  // Edit Ingredient
  const [doAddElementary] = useAddElementaryMutation();
  const [doChangeElementaryWeight] = useChangeElementaryWeightMutation();
  const [doDeleteElementary] = useDeleteElementaryMutation();

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

  // defaultValues
  let defaultValues = {
    foodRecipeName: originalFoodRecipeName,
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
  } = useForm<TFoodRecipeEditFormData>({
    resolver: yupResolver(editFoodRecipeValidationSchema),
    mode: "onChange",
    defaultValues: defaultValues,
  });

  // Load Options for Async Select (Add new Ingredient)
  const loadSelectIngredientsOptions = () => {
    const filteredElementaryOptions: TSelectElement[] =
      dataGetAllFoodElementary?.items?.map((item: IFoodElementary) => {
        return { value: item.id, label: item.name };
      });

    const filteredOptions = filteredElementaryOptions?.filter(
      (item) =>
        !ingredientsForbiddenToAddIdsRef.current.includes(item?.value) &&
        !newIngredientsForbiddenToAddIdsRef.current.includes(item?.value)
    );

    filteredOptions?.sort(compareLabels);

    setSelectIngredientsOptions(filteredOptions ?? []);
  };

  useEffect(() => {
    loadSelectIngredientsOptions();
  }, [dataGetAllFoodElementary]);

  // For Generating Original Ingredients Fields
  const {
    fields: originalIngredientsFields,
    append: originalIngredientsAppend,
    remove: originalIngredientsRemove,
  } = useFieldArray({
    name: "originalIngredientsList",
    control,
  });

  // For Generating Add Ingredients Fields
  const {
    fields: addIngredientsListFields,
    append: addIngredientsListAppend,
    remove: addIngredientsListRemove,
  } = useFieldArray({
    name: "addIngredientsList",
    control,
  });

  const handleRemoveOriginalIngredient = (itemIndex: number) => {
    const elementaryId = getValues(
      `originalIngredientsList.${itemIndex}.ingredientInfo.value`
    );

    originalIngredientsToRemoveIdsRef.current.push(elementaryId);

    const indexInIngredientsForbiddenToAddIdsRef =
      ingredientsForbiddenToAddIdsRef.current.indexOf(elementaryId);

    if (indexInIngredientsForbiddenToAddIdsRef > -1) {
      ingredientsForbiddenToAddIdsRef.current.splice(
        indexInIngredientsForbiddenToAddIdsRef,
        1
      );
    }

    originalIngredientsRemove(itemIndex);
    loadSelectIngredientsOptions();
  };

  const handleRemoveIngredientToAdd = (itemIndex: number) => {
    if (
      itemIndex > -1 &&
      itemIndex < newIngredientsForbiddenToAddIdsRef.current.length
    ) {
      newIngredientsForbiddenToAddIdsRef.current.splice(itemIndex, 1);
    }

    addIngredientsListRemove(itemIndex);
    loadSelectIngredientsOptions();
  };

  const handleOnSelectInputChange = () => {
    trigger();
  };

  const handleOnSelectValueChange = (
    newElement: TSelectElement,
    addFoodIndex: number
  ) => {
    if (
      addFoodIndex > -1 &&
      addFoodIndex < newIngredientsForbiddenToAddIdsRef.current.length
    ) {
      newIngredientsForbiddenToAddIdsRef.current.splice(
        addFoodIndex,
        1,
        newElement.value
      );
    }

    loadSelectIngredientsOptions();
  };

  useEffect(() => {
    const originalIngredients = ingredients.map((ingredient: IIngredient) => {
      return {
        ingredientInfo: {
          label: ingredient.foodElementary.name,
          value: ingredient.foodElementary.id,
        },
        weight: ingredient.elementaryWeight.toString(),
      };
    });

    originalIngredients.forEach((originalIngredient) => {
      originalIngredientsAppend(originalIngredient);
      ingredientsForbiddenToAddIdsRef.current.push(
        originalIngredient.ingredientInfo.value
      );
    });

    loadSelectIngredientsOptions();
  }, []);

  const onSubmit: SubmitHandler<TFoodRecipeEditFormData> = async (data) => {
    setMainIsLoading(true);

    // Delete Ingredients List
    const deleteIngredientsList = originalIngredientsToRemoveIdsRef.current;

    // Change Weights List
    let changeWeightsList = [];

    const originalIngredientsList = data?.originalIngredientsList?.map(
      (item) => {
        return {
          foodElementaryId: item?.ingredientInfo?.value,
          weight: item?.weight,
        };
      }
    );

    const ingredientsWithoutDeleted = ingredients.filter(
      (item) => !deleteIngredientsList.includes(item.foodElementary.id)
    );

    for (const originalIngredient of originalIngredientsList) {
      const ingredientToChange = ingredientsWithoutDeleted.find(
        (item) => item.foodElementary.id == originalIngredient.foodElementaryId
      );

      if (
        ingredientToChange != undefined &&
        ingredientToChange.elementaryWeight.toString() !=
          originalIngredient.weight
      ) {
        changeWeightsList.push(originalIngredient);
      }
    }

    // Add Ingredients List
    const addIngredientsList = data?.addIngredientsList?.map((item) => {
      return {
        foodElementaryId: item?.ingredientInfo?.value,
        weight: item?.weight,
      };
    });

    // Change Food Recipe Name
    const foodRecipeName = data.foodRecipeName;

    if (foodRecipeName != originalFoodRecipeName) {
      const changeFoodRecipeNameData = {
        id: foodRecipeId,
        data: {
          name: foodRecipeName,
        },
        isInvalidationNeeded:
          deleteIngredientsList.length +
            changeWeightsList.length +
            addIngredientsList.length >
          0
            ? false
            : true,
      };

      await doChangeFoodRecipeName(changeFoodRecipeNameData)
        .unwrap()
        .catch((error) => {
          handleApiCallError({
            error: error,
            dispatch: dispatch,
            navigate: navigate,
          });
        });
    }

    // Delete Ingredients
    for (const [
      index,
      ingredientToDeleteId,
    ] of deleteIngredientsList.entries()) {
      const deleteIngredientData = {
        foodRecipeId: foodRecipeId,
        foodElementaryId: ingredientToDeleteId,
        isInvalidationNeeded:
          index == deleteIngredientsList.length - 1 &&
          changeWeightsList.length + addIngredientsList.length == 0
            ? true
            : false,
      };

      await doDeleteElementary(deleteIngredientData)
        .unwrap()
        .catch((error) => {
          handleApiCallError({
            error: error,
            dispatch: dispatch,
            navigate: navigate,
          });
        });
    }

    // Change Ingredients Weight
    for (const [index, originalIngredient] of changeWeightsList.entries()) {
      const changeIngredientWeightData = {
        foodRecipeId: foodRecipeId,
        foodElementaryId: originalIngredient.foodElementaryId,
        data: {
          weight: originalIngredient.weight,
        },
        isInvalidationNeeded:
          index == changeWeightsList.length - 1 &&
          addIngredientsList.length == 0
            ? true
            : false,
      };

      await doChangeElementaryWeight(changeIngredientWeightData)
        .unwrap()
        .catch((error) => {
          handleApiCallError({
            error: error,
            dispatch: dispatch,
            navigate: navigate,
          });
        });
    }

    // Add New Ingredients
    for (const [index, ingredient] of addIngredientsList.entries()) {
      const addIngredientData = {
        foodRecipeId: foodRecipeId,
        data: {
          foodElementaryId: ingredient.foodElementaryId,
          weight: ingredient.weight,
        },
        isInvalidationNeeded:
          index == addIngredientsList.length - 1 ? true : false,
      };

      await doAddElementary(addIngredientData)
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
    setIsEditMode(!isEditMode);
  };

  return (
    <div className="w-full max-w-5xl flex flex-col justify-center items-start">
      <form
        className="flex flex-col flex-wrap justify-center w-full"
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
      >
        {isLoadingGetAllFoodElementary ? (
          <div className="flex justify-center items-center">
            <Preloader />
          </div>
        ) : (
          <>
            <div className="text-xl w-full flex-grow">
              <InputIlluminated
                id={"FoodRecipeEditForm_foodRecipeName"}
                type="text"
                inputLabel="Название блюда"
                register={{
                  ...register("foodRecipeName"),
                }}
                isRequired={true}
                className="h-[67px]"
                labelClassName="text-lg"
                isError={!!errors?.foodRecipeName}
                errorMessagesList={
                  [errors?.foodRecipeName?.message].filter(
                    (item) => !!item
                  ) as string[]
                }
              />
            </div>

            <div className="flex flex-col mt-5">
              {originalIngredientsFields.map((item, index) => {
                return (
                  <DisabledSelectRowWithWeightField
                    key={`FoodRecipeEditForm_div_originalIngredientsFields_${item.id}_${index}`}
                    itemId={item.id}
                    itemIndex={index}
                    label={"Ингредиент"}
                    selectPlaceholder={"Название..."}
                    handleRemoveItem={handleRemoveOriginalIngredient}
                    controllerName={
                      `originalIngredientsList.${index}.ingredientInfo` as const
                    }
                    control={control}
                    register={{
                      ...register(
                        `originalIngredientsList.${index}.weight` as const
                      ),
                    }}
                    isDeleteButtonDisabled={
                      originalIngredientsFields.length +
                        addIngredientsListFields.length <
                      2
                        ? true
                        : false
                    }
                    hasErrors={!!errors?.originalIngredientsList}
                    errorMessagesList={
                      [
                        errors?.originalIngredientsList?.[index]?.ingredientInfo
                          ?.value?.message,
                        errors?.originalIngredientsList?.[index]?.weight
                          ?.message,
                      ].filter((item) => !!item) as string[]
                    }
                  />
                );
              })}

              {addIngredientsListFields.map((item, index) => {
                return (
                  <SelectRowWithWeightField
                    key={`FoodRecipeEditForm_Div_addIngredientsList_${item.id}_${index}`}
                    itemId={item.id}
                    itemIndex={index}
                    label={"Ингредиент"}
                    selectPlaceholder={"Название..."}
                    handleRemoveItem={handleRemoveIngredientToAdd}
                    controllerName={
                      `addIngredientsList.${index}.ingredientInfo` as const
                    }
                    control={control}
                    register={{
                      ...register(
                        `addIngredientsList.${index}.weight` as const
                      ),
                    }}
                    handleOnSelectInputChange={handleOnSelectInputChange}
                    handleOnSelectValueChange={handleOnSelectValueChange}
                    isDeleteButtonDisabled={
                      originalIngredientsFields.length +
                        addIngredientsListFields.length <
                      2
                        ? true
                        : false
                    }
                    hasErrors={!!errors?.addIngredientsList}
                    errorMessagesList={
                      [
                        errors?.addIngredientsList?.[index]?.ingredientInfo
                          ?.value?.message,
                        errors?.addIngredientsList?.[index]?.weight?.message,
                      ].filter((item) => !!item) as string[]
                    }
                    linkForNoOptionsMessage={`${ROUTES_LIST.foodSimple}#`}
                    selectOptions={selectIngredientsOptions}
                  />
                );
              })}

              <div className="w-full max-w-[280px] mt-3">
                <ButtonIlluminated
                  children={"Еще один ингредиент"}
                  type="button"
                  onClick={() => {
                    newIngredientsForbiddenToAddIdsRef.current.push("");

                    addIngredientsListAppend({
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

export default FoodRecipeEditForm;
