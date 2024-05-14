import { FC, useEffect, useRef } from "react";
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { IFoodElementary, IIngredient } from "../../../global/types/types";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import NoOptionsMessage from "../../../components/NoOptionsMessage/NoOptionsMessage";
import { Player } from "@lordicon/react";
import EDIT_ICON from "../../../global/assets/system-regular-63-settings-cog.json";
import DELETE_ICON from "../../../global/assets/system-regular-39-trash.json";
import {
  useAddElementaryMutation,
  useChangeElementaryWeightMutation,
  useChangeFoodRecipeNameMutation,
  useDeleteElementaryMutation,
  useDeleteFoodRecipeMutation,
} from "../api/foodRecipe.api";
import { useGetAllFoodElementaryQuery } from "../../FoodElementaryModule";
import {
  editFoodRecipeValidationSchema,
  selectStyles,
} from "../constants/constants";
import InputIlluminated from "../../../ui/InputIlluminated/InputIlluminated";
import ButtonIlluminated from "../../../ui/ButtonIlluminated/ButtonIlluminated";

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

  const editIconPlayerRef = useRef<Player>(null);
  const deleteIconPlayerRef = useRef<Player>(null);
  const ICON_SIZE = 28;

  // Delete Food Recipe
  const [doDeleteFoodRecipe] = useDeleteFoodRecipeMutation();
  const deleteFoodRecipe = () => {
    doDeleteFoodRecipe(foodRecipeId).catch((e: any) => console.log(e));
  };

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

    // console.log("\n-----------------------");
    // console.log("foodRecipeNameFilled", foodRecipeNameFilled);
    // console.log("emptyNewIngredients", emptyNewIngredients);
    // console.log("isAllIngredientsListsEmply", isAllIngredientsListsEmply);
    // console.log("newIngredientsWeightErrors", newIngredientsWeightErrors);
    // console.log(
    //   "originalIngredientsWeightErrors",
    //   originalIngredientsWeightErrors
    // );
    // console.log("-----------------------\n");

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

  // const onSubmit: SubmitHandler<TFoodRecipeEditFormData> = async (data) => {
  //   console.log("data", data);
  //   setIsEditMode(false);
  // };

  return (
    <div className="w-full max-w-5xl flex flex-col justify-center items-start pl-7 pr-6 py-7 gap-4">
      <form
        className="flex flex-col flex-wrap justify-center w-full pb-8 -mt-16"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="text-xl w-full flex-grow">
          <InputIlluminated
            id={"foodRecipeName"}
            type="text"
            placeholder="Название блюда"
            disableIllumination={true}
            additionalStyles=" h-[67px] border-0 "
            register={{
              ...register("foodRecipeName"),
            }}
            isRequired={true}
          />
        </div>
        {errors.foodRecipeName && (
          <div
            className={
              Object.keys(errors).length > 0
                ? " flex flex-col gap-y-2 justify-center "
                : " hidden "
            }
          >
            <p
              className={errors.foodRecipeName ? "text-pink-500 " : " hidden "}
            >
              {errors.foodRecipeName?.message}
            </p>
          </div>
        )}

        <div className="flex flex-col">
          <h3 className="text-xl my-3">Ингредиенты:</h3>

          {originalIngredientsFields.map((select, index) => {
            return (
              <div
                key={`FoodRecipeEditForm_div_originalIngredientsFields_${select.id}_${index}`}
                className="form-control flex flex-col"
              >
                <div className="gap-x-3 flex mb-1">
                  <div className="flex flex-col justify-center gap-3 flex-grow mb-3">
                    <span className="flex gap-x-1">
                      <h3>Ингредиент</h3>
                      <p className="text-red">*</p>
                    </span>
                    <Controller
                      key={`FoodRecipeEditForm_controller_originalIngredientsFields_${select.id}_${index}`}
                      name={
                        `originalIngredientsList.${index}.ingredientInfo` as const
                      }
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          key={`FoodRecipeEditForm_select_originalIngredientsFields_${select.id}_${index}`}
                          className="relative text-sm rounded-xl  "
                          styles={selectStyles}
                          isDisabled={true}
                        />
                      )}
                    />
                  </div>

                  <div className="-mt-4 sm:max-w-[100px] max-w-[80px] flex-grow">
                    <InputIlluminated
                      id={`originalIngredientsList.${index}.weight`}
                      type="number"
                      placeholder="Вес (г)"
                      disableIllumination={true}
                      additionalStyles=" h-[67px] border-0 "
                      register={{
                        ...register(
                          `originalIngredientsList.${index}.weight` as const
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
                        handleRemoveOriginalIngredient(index);
                      }}
                      buttonPadding=" p-[14px] "
                      additionalStyles=" "
                    />
                  </div>
                </div>

                {errors.originalIngredientsList && (
                  <div
                    className={
                      Object.keys(errors).length > 0 &&
                      errors.originalIngredientsList[index]
                        ? "flex flex-col mb-2 px-5 gap-y-2 justify-center"
                        : "hidden"
                    }
                  >
                    <p
                      className={
                        errors.originalIngredientsList[index]?.ingredientInfo
                          ?.value
                          ? "text-pink-500 "
                          : " hidden "
                      }
                    >
                      {
                        errors.originalIngredientsList[index]?.ingredientInfo
                          ?.value?.message
                      }
                    </p>
                    <p
                      className={
                        errors.originalIngredientsList[index]?.weight
                          ? "text-pink-500 "
                          : " hidden "
                      }
                    >
                      {errors.originalIngredientsList[index]?.weight?.message}
                    </p>
                  </div>
                )}
              </div>
            );
          })}

          {addIngredientsListFields.map((select, index) => {
            return (
              <div
                key={`FoodRecipeEditForm_Div_addIngredientsList_${select.id}_${index}`}
                className="form-control flex flex-col"
              >
                <div className="gap-x-3 flex mb-1">
                  <div className="flex flex-col justify-center gap-3 flex-grow mb-3">
                    <span className="flex gap-x-1">
                      <h3>Ингредиент</h3>
                      <p className="text-red">*</p>
                    </span>
                    <Controller
                      key={`FoodRecipeEditForm_Controller_addIngredientsList_${select.id}_${index}`}
                      name={
                        `addIngredientsList.${index}.ingredientInfo` as const
                      }
                      control={control}
                      render={({ field }) => (
                        <AsyncSelect
                          {...field}
                          key={`FoodRecipeEditForm_AsyncSelect_addIngredientsList_${select.id}_${index}`}
                          className="relative text-sm rounded-xl  "
                          components={{ NoOptionsMessage }}
                          styles={selectStyles}
                          placeholder="Введите название ингредиента"
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
                      id={`FoodRecipeEditForm_addIngredientsList.${index}.weight`}
                      type="number"
                      placeholder="Вес (г)"
                      disableIllumination={true}
                      additionalStyles=" h-[67px] border-0 "
                      register={{
                        ...register(
                          `addIngredientsList.${index}.weight` as const
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
                        handleRemoveIngredientToAdd(index);
                      }}
                      buttonPadding=" p-[14px] "
                      additionalStyles=" "
                    />
                  </div>
                </div>

                {errors.addIngredientsList && (
                  <div
                    className={
                      Object.keys(errors).length > 0 &&
                      errors.addIngredientsList[index]
                        ? "flex flex-col mb-2 px-5 gap-y-2 justify-center"
                        : "hidden"
                    }
                  >
                    <p
                      className={
                        errors.addIngredientsList[index]?.ingredientInfo?.value
                          ? "text-pink-500 "
                          : " hidden "
                      }
                    >
                      {
                        errors.addIngredientsList[index]?.ingredientInfo?.value
                          ?.message
                      }
                    </p>
                    <p
                      className={
                        errors.addIngredientsList[index]?.weight
                          ? "text-pink-500 "
                          : " hidden "
                      }
                    >
                      {errors.addIngredientsList[index]?.weight?.message}
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
                newIngredientsForbiddenToAddIdsRef.current.push("");

                addIngredientsListAppend({
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

      <div className="order-[-1] ml-auto gap-x-2 flex justify-center items-start">
        <span role="button" onClick={() => setIsEditMode(false)}>
          <span
            onMouseEnter={() => editIconPlayerRef.current?.playFromBeginning()}
          >
            <Player
              ref={editIconPlayerRef}
              icon={EDIT_ICON}
              size={ICON_SIZE}
              colorize="#0d0b26"
            />
          </span>
        </span>

        <span role="button" onClick={() => deleteFoodRecipe()}>
          <span
            onMouseEnter={() =>
              deleteIconPlayerRef.current?.playFromBeginning()
            }
          >
            <Player
              ref={deleteIconPlayerRef}
              icon={DELETE_ICON}
              size={ICON_SIZE}
              colorize="#0d0b26"
            />
          </span>
        </span>
      </div>
    </div>
  );
};

export default FoodRecipeEditForm;
