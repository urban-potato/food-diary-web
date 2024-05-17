import { FC, useEffect, useRef } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { IFoodElementary, IIngredient } from "../../../../global/types/types";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  useAddElementaryMutation,
  useChangeElementaryWeightMutation,
  useChangeFoodRecipeNameMutation,
  useDeleteElementaryMutation,
} from "../../api/foodRecipe.api";
import { useGetAllFoodElementaryQuery } from "../../../FoodElementaryModule";
import { editFoodRecipeValidationSchema } from "../../constants/constants";
import InputIlluminated from "../../../../ui/InputIlluminated/InputIlluminated";
import ButtonIlluminated from "../../../../ui/ButtonIlluminated/ButtonIlluminated";
import DisabledSelectRowWithWeightField from "../../../../components/DisabledSelectRowWithWeightField/DisabledSelectRowWithWeightField";
import AsyncSelectRowWithWeightField from "../../../../components/AsyncSelectRowWithWeightField/AsyncSelectRowWithWeightField";

type TProps = {
  foodRecipeId: string;
  originalFoodRecipeName: string;
  ingredients: IIngredient[];
  setIsEditMode: Function;
};

type TFoodRecipeEditFormData = {
  foodRecipeName: string;
  addIngredientsList: {
    ingredientInfo?: {
      label?: string | undefined;
      value: string;
    };
    weight: number;
  }[];
  originalIngredientsList: {
    ingredientInfo: {
      label: string;
      value: string;
    };
    weight: number;
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
}) => {
  const ingredientsForbiddenToAddIdsRef = useRef<Array<String>>(new Array());
  const newIngredientsForbiddenToAddIdsRef = useRef<Array<String>>(new Array());

  // Ingredients to delete
  const originalIngredientsToRemoveIdsRef = useRef<Array<String>>(new Array());

  const [doChangeFoodRecipeName] = useChangeFoodRecipeNameMutation();

  // Edit Ingredient
  const [doAddElementary] = useAddElementaryMutation();
  const [doChangeElementaryWeight] = useChangeElementaryWeightMutation();
  const [doDeleteElementary] = useDeleteElementaryMutation();

  // Food Elementaries for Async Select
  const {
    isLoading: isLoadingGetAllFoodElementary,
    data: dataGetAllFoodElementary,
    error: errorGetAllFoodElementary,
  } = useGetAllFoodElementaryQuery(undefined);

  // defaultValues
  let defaultValues = {
    foodRecipeName: originalFoodRecipeName,
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
  } = useForm<TFoodRecipeEditFormData>({
    resolver: yupResolver(editFoodRecipeValidationSchema),
    mode: "onChange",
    defaultValues: defaultValues,
  });

  // Load Options for Async Select (Add new Ingredient)
  const loadOptions = (searchValue: string, callback: any) => {
    const filteredElementaryData: IFoodElementary[] =
      dataGetAllFoodElementary?.items.filter((item: IFoodElementary) =>
        item.name.toLowerCase().includes(searchValue.toLowerCase())
      );

    const filteredElementaryOptions = filteredElementaryData.map((item) => {
      return { value: item.id, label: item.name };
    });

    const filteredOptions = filteredElementaryOptions.filter(
      (item) =>
        !ingredientsForbiddenToAddIdsRef.current.includes(item.value) &&
        !newIngredientsForbiddenToAddIdsRef.current.includes(item.value)
    );

    callback(filteredOptions);
  };

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
  };

  const handleRemoveIngredientToAdd = (itemIndex: number) => {
    if (
      itemIndex > -1 &&
      itemIndex < newIngredientsForbiddenToAddIdsRef.current.length
    ) {
      newIngredientsForbiddenToAddIdsRef.current.splice(itemIndex, 1);
    }

    addIngredientsListRemove(itemIndex);
  };

  const handleOnInputChange = () => {
    trigger();
  };

  const handleOnChange = (newElement: TSelectElement, addFoodIndex: number) => {
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
  };

  let checkIfFilledRight = () => {
    let foodRecipeNameFilled = getValues("foodRecipeName");

    let emptyNewIngredients = getValues("addIngredientsList")?.find(
      (item) => item.ingredientInfo === undefined
    );

    const isAllIngredientsListsEmply =
      !getValues("addIngredientsList")?.length &&
      !getValues("originalIngredientsList")?.length;

    let newIngredientsWeightErrors = errors?.addIngredientsList;
    let originalIngredientsWeightErrors = errors?.originalIngredientsList;

    let result =
      foodRecipeNameFilled &&
      !errors?.foodRecipeName &&
      !emptyNewIngredients &&
      !newIngredientsWeightErrors &&
      !originalIngredientsWeightErrors &&
      !isAllIngredientsListsEmply
        ? true
        : false;

    return result;
  };

  useEffect(() => {
    const originalIngredients = ingredients.map((ingredient: IIngredient) => {
      return {
        ingredientInfo: {
          label: ingredient.foodElementary.name,
          value: ingredient.foodElementary.id,
        },
        weight: ingredient.elementaryWeight,
      };
    });

    originalIngredients.forEach((originalIngredient) => {
      originalIngredientsAppend(originalIngredient);
      ingredientsForbiddenToAddIdsRef.current.push(
        originalIngredient.ingredientInfo.value
      );
    });
  }, []);

  const onSubmit: SubmitHandler<TFoodRecipeEditFormData> = async (data) => {
    console.log("\nFoodRecipeEditForm Submit\n");
    console.log("data", data);

    // Change Food Recipe Name
    const foodRecipeName = data.foodRecipeName;

    if (foodRecipeName != originalFoodRecipeName) {
      const changeFoodRecipeNameData = {
        id: foodRecipeId,
        data: {
          name: foodRecipeName,
        },
      };

      await doChangeFoodRecipeName(changeFoodRecipeNameData);

      console.log("Change Food Recipe Name");
    }

    // Delete Ingredients
    const ingredientsIdsToDelete = originalIngredientsToRemoveIdsRef.current;

    for (const ingredientToDeleteId of ingredientsIdsToDelete) {
      const deleteIngredientData = {
        foodRecipeId: foodRecipeId,
        foodElementaryId: ingredientToDeleteId,
      };

      await doDeleteElementary(deleteIngredientData).catch((e) =>
        console.log(e)
      );

      console.log("Delete Ingredients");
    }

    // Change Ingredients Weight
    const originalIngredientsList = data?.originalIngredientsList?.map(
      (item) => {
        return {
          foodElementaryId: item?.ingredientInfo?.value,
          weight: item?.weight,
        };
      }
    );

    const ingredientsWithoutDeleted = ingredients.filter(
      (item) => !ingredientsIdsToDelete.includes(item.foodElementary.id)
    );

    for (const originalIngredient of originalIngredientsList) {
      const ingredientToChange = ingredientsWithoutDeleted.find(
        (item) => item.foodElementary.id == originalIngredient.foodElementaryId
      );

      if (
        ingredientToChange != undefined &&
        ingredientToChange.elementaryWeight != originalIngredient.weight
      ) {
        const changeIngredientWeightData = {
          foodRecipeId: foodRecipeId,
          foodElementaryId: originalIngredient.foodElementaryId,
          data: {
            weight: originalIngredient.weight,
          },
        };

        await doChangeElementaryWeight(changeIngredientWeightData).catch((e) =>
          console.log(e)
        );

        console.log("Change Ingredient Weight");
      }
    }

    // Add New Ingredients
    const addIngredientsList = data?.addIngredientsList?.map((item) => {
      return {
        foodElementaryId: item?.ingredientInfo?.value,
        weight: item?.weight,
      };
    });

    for (const ingredient of addIngredientsList) {
      const addIngredientData = {
        foodRecipeId: foodRecipeId,
        data: {
          foodElementaryId: ingredient.foodElementaryId,
          weight: ingredient.weight,
        },
      };

      await doAddElementary(addIngredientData).catch((e) => console.log(e));

      console.log("Add New Ingredients");
    }

    reset();

    setIsEditMode(false);
  };

  return (
    <div className="w-full max-w-5xl flex flex-col justify-center items-start -mt-5">
      <form
        className="flex flex-col flex-wrap justify-center w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="text-xl w-full flex-grow">
          <InputIlluminated
            id={"FoodRecipeEditForm_foodRecipeName"}
            type="text"
            placeholder="Название блюда"
            disableIllumination={true}
            additionalStyles=" h-[67px] border-0 "
            register={{
              ...register("foodRecipeName"),
            }}
            isRequired={true}
            labelSize={"text-lg"}
          />
        </div>
        {errors.foodRecipeName && (
          <div
            className={
              Object.keys(errors).length > 0
                ? "flex flex-col mt-1 justify-center items-start"
                : "hidden"
            }
          >
            <p
              className={errors.foodRecipeName ? "text-pink-500" : "hidden"}
            >
              {errors.foodRecipeName?.message}
            </p>
          </div>
        )}

        <div className="flex flex-col mt-5">
          {originalIngredientsFields.map((item, index) => {
            return (
              <DisabledSelectRowWithWeightField
                key={`FoodRecipeEditForm_div_originalIngredientsFields_${item.id}_${index}`}
                itemId={item.id}
                itemIndex={index}
                label={"Ингредиент"}
                selectPlaceholder={"Введите название ингредиента"}
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
                errors={errors}
                errorsGroup={errors.originalIngredientsList}
                errorSelect={
                  errors.originalIngredientsList?.[index]?.ingredientInfo?.value
                }
                errorFeild={errors.originalIngredientsList?.[index]?.weight}
                isDeleteButtonDisabled={
                  originalIngredientsFields.length +
                    addIngredientsListFields.length <
                  2
                    ? true
                    : false
                }
              />
            );
          })}

          {addIngredientsListFields.map((item, index) => {
            return (
              <AsyncSelectRowWithWeightField
                key={`FoodRecipeEditForm_Div_addIngredientsList_${item.id}_${index}`}
                itemId={item.id}
                itemIndex={index}
                label={"Ингредиент"}
                selectPlaceholder={"Введите название ингредиента"}
                handleRemoveItem={handleRemoveIngredientToAdd}
                controllerName={
                  `addIngredientsList.${index}.ingredientInfo` as const
                }
                control={control}
                register={{
                  ...register(`addIngredientsList.${index}.weight` as const),
                }}
                errors={errors}
                errorsGroup={errors.addIngredientsList}
                errorSelect={
                  errors.addIngredientsList?.[index]?.ingredientInfo?.value
                }
                errorFeild={errors.addIngredientsList?.[index]?.weight}
                loadSelectOptions={loadOptions}
                handleOnSelectInputChange={handleOnInputChange}
                handleOnSelectValueChange={handleOnChange}
                isDeleteButtonDisabled={
                  originalIngredientsFields.length +
                    addIngredientsListFields.length <
                  2
                    ? true
                    : false
                }
              />
            );
          })}

          <div className="w-full max-w-[280px] mt-3">
            <ButtonIlluminated
              label={"Еще один ингредиент"}
              isDarkButton={true}
              isIlluminationFull={false}
              onClick={() => {
                newIngredientsForbiddenToAddIdsRef.current.push("");

                addIngredientsListAppend({
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
      </form>
    </div>
  );
};

export default FoodRecipeEditForm;
