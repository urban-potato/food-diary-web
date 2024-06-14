import { FC, useEffect, useRef } from "react";
import {
  useAddElementaryMutation,
  useCreateFoodRecipeMutation,
} from "../api/food-recipe.api";
import { useGetAllFoodElementaryQuery } from "../../FoodElementaryModule";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { createFoodRecipeValidationSchema } from "../constants/FoodRecipeModule.constants";
import InputIlluminated from "../../../ui/InputIlluminated/InputIlluminated";
import ButtonIlluminated from "../../../ui/ButtonIlluminated/ButtonIlluminated";
import { IFoodElementary } from "../../../global/types/entities-types";
import AsyncSelectRowWithWeightField from "../../../components/AsyncSelectRowWithWeightField/AsyncSelectRowWithWeightField";
import { useAppDispatch } from "../../../global/store/store-hooks";
import { useNavigate } from "react-router-dom";
import { handleApiCallError } from "../../../global/helpers/handle-api-call-error.helper";
import Preloader from "../../../components/Preloader/Preloader";
import { compareLabels } from "../../../global/helpers/compare-labels.helper";
import { ROUTES_LIST } from "../../../global/constants/constants";

type TProps = {
  setShowCreateForm: Function;
};

type TFoodRecipeCreateFormData = {
  foodRecipeName: string;
  addFoodList: {
    foodInfo?: {
      label?: string | undefined;
      value: string;
    };
    weight: string;
  }[];
};

type TSelectElement = {
  label: string;
  value: string;
};

const FoodRecipeCreateForm: FC<TProps> = ({ setShowCreateForm }) => {
  const newFoodForbiddenToAddIdsRef = useRef<Array<String>>(new Array());

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [doCreateFoodRecipe] = useCreateFoodRecipeMutation();
  const [doAddElementary] = useAddElementaryMutation();

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

  const loadOptions = (searchValue: string, callback: any) => {
    const filteredElementaryData: IFoodElementary[] =
      dataGetAllFoodElementary?.items.filter((item: IFoodElementary) =>
        item.name.toLowerCase().includes(searchValue.toLowerCase())
      );

    const filteredElementaryOptions = filteredElementaryData.map((item) => {
      return { value: item.id, label: item.name };
    });

    const filteredOptions = filteredElementaryOptions.filter(
      (item) => !newFoodForbiddenToAddIdsRef.current.includes(item.value)
    );

    filteredOptions.sort(compareLabels);

    callback(filteredOptions);
  };

  // useForm
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isValid },
    control,
    trigger,
  } = useForm<TFoodRecipeCreateFormData>({
    resolver: yupResolver(createFoodRecipeValidationSchema),
    mode: "onChange",
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

  const onSubmit: SubmitHandler<TFoodRecipeCreateFormData> = async (data) => {
    // Create Food Recipe
    const createFoodRecipeData = {
      data: { name: data.foodRecipeName },
      isInvalidationNeeded: false,
    };

    await doCreateFoodRecipe(createFoodRecipeData)
      .unwrap()
      .then(async (responseFoodRecipeId) => {
        // Add Elementaries
        const addElementaryList = data?.addFoodList?.map((item) => {
          return {
            foodElementaryId: item?.foodInfo?.value,
            weight: item?.weight,
          };
        });

        for (const [index, foodElementary] of addElementaryList.entries()) {
          const addFoodElementaryData = {
            foodRecipeId: responseFoodRecipeId,
            data: {
              foodElementaryId: foodElementary.foodElementaryId,
              weight: foodElementary.weight,
            },
            isInvalidationNeeded:
              index == addElementaryList.length - 1 ? true : false,
          };

          await doAddElementary(addFoodElementaryData)
            .unwrap()
            .catch((error) => {
              handleApiCallError({
                error: error,
                dispatch: dispatch,
                navigate: navigate,
              });
            });
        }
      })
      .catch((error) => {
        handleApiCallError({
          error: error,
          dispatch: dispatch,
          navigate: navigate,
        });
      });

    reset();

    // Reset Async Select Field,
    // because it stays the same if there was only one
    if (addFoodListFields.length === 1) {
      addFoodListRemove(0);
      addFoodListAppend({
        weight: "0",
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

  const handleAddSelect = () => {
    newFoodForbiddenToAddIdsRef.current.push("");

    addFoodListAppend({
      weight: "0",
    });
  };

  useEffect(() => {
    handleAddSelect();
  }, []);

  return (
    <section className="flex-grow-100 w-full flex flex-col flex-wrap justify-center items-center mb-3">
      <h2 className="mt-4 mb-3">Новая запись</h2>

      <div className="outer_box_style group w-full max-w-5xl mt-5">
        <div className="box_style"></div>
        <form
          className="box_content_transition flex flex-col flex-wrap w-full justify-center p-7"
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
                  id={"FoodRecipeCreateForm_foodRecipeName"}
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
                {addFoodListFields.map((item, index) => {
                  return (
                    <AsyncSelectRowWithWeightField
                      key={`FoodRecipeCreateForm_Div_addFoodList_${item.id}_${index}`}
                      itemId={item.id}
                      itemIndex={index}
                      label={"Ингредиент"}
                      selectPlaceholder={"Введите название простого блюда"}
                      handleRemoveItem={handleRemoveFoodToAdd}
                      controllerName={`addFoodList.${index}.foodInfo` as const}
                      control={control}
                      register={{
                        ...register(`addFoodList.${index}.weight` as const),
                      }}
                      loadSelectOptions={loadOptions}
                      handleOnSelectInputChange={handleOnInputChange}
                      handleOnSelectValueChange={handleOnChange}
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
                      linkForNoOptionsMessage={`${ROUTES_LIST.foodSimple}#createForm`}
                    />
                  );
                })}

                <div className="w-full max-w-[280px] mt-3">
                  <ButtonIlluminated
                    children={"Еще одно блюдо"}
                    type="button"
                    onClick={() => handleAddSelect()}
                    className="p-[12px]"
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

export default FoodRecipeCreateForm;
