import { FC, useRef } from "react";
import { Player } from "@lordicon/react";

import DELETE_ICON from "../../../global/assets/system-regular-39-trash.json";
import {
  useAddElementaryMutation,
  useCreateFoodRecipeMutation,
} from "../api/foodRecipe.api";
import { useGetAllFoodElementaryQuery } from "../../FoodElementaryModule";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import {
  createFoodRecipeValidationSchema,
  selectStyles,
} from "../constants/constants";
import AsyncSelect from "react-select/async";
import NoOptionsMessage from "../../../components/NoOptionsMessage/NoOptionsMessage";
import InputIlluminated from "../../../ui/InputIlluminated/InputIlluminated";
import ButtonIlluminated from "../../../ui/ButtonIlluminated/ButtonIlluminated";
import { IFoodElementary } from "../../../global/types/types";

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
    weight: number;
  }[];
};

type TSelectElement = {
  label: string;
  value: string;
};

const FoodRecipeCreateForm: FC<TProps> = ({ setShowCreateForm }) => {
  const newFoodForbiddenToAddIdsRef = useRef<Array<String>>(new Array());

  const deleteIconPlayerRef = useRef<Player>(null);
  const ICON_SIZE = 28;

  const [doCreateFoodRecipe] = useCreateFoodRecipeMutation();
  const [doAddElementary] = useAddElementaryMutation();

  // Food Elementaries for Async Select
  const {
    isLoading: isLoadingGetAllFoodElementary,
    data: dataGetAllFoodElementary,
    error: errorGetAllFoodElementary,
  } = useGetAllFoodElementaryQuery(undefined);

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

    callback(filteredOptions);
  };

  // defaultValues
  let defaultValues = {
    addFoodList: [
      {
        weight: 0,
      },
    ],
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
  } = useForm<TFoodRecipeCreateFormData>({
    resolver: yupResolver(createFoodRecipeValidationSchema),
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

  const onSubmit: SubmitHandler<TFoodRecipeCreateFormData> = async (data) => {
    // Create Food Recipe
    const createFoodRecipeData = {
      name: data.foodRecipeName,
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

        for (const foodElementary of addElementaryList) {
          const addFoodElementaryData = {
            foodRecipeId: responseFoodRecipeId,
            data: {
              foodElementaryId: foodElementary.foodElementaryId,
              weight: foodElementary.weight,
            },
          };

          await doAddElementary(addFoodElementaryData).catch((e) =>
            console.log(e)
          );

          console.log("Add Elementaries");
        }
      })
      .catch((e) => console.log(e));

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
    let foodRecipeNameFilled = getValues("foodRecipeName");
    let emptyMeals = getValues("addFoodList")?.find(
      (item) => item.foodInfo === undefined
    );

    const isAddFoodListEmply = !getValues("addFoodList")?.length;

    let addFoodWeightErrors = errors?.addFoodList;

    console.log("-----------------------");
    console.log("foodRecipeNameFilled", foodRecipeNameFilled);
    console.log("emptyMeals", emptyMeals);
    console.log("isAddFoodListEmply", isAddFoodListEmply);
    console.log("addFoodWeightErrors", addFoodWeightErrors);
    console.log("-----------------------");

    let result =
      foodRecipeNameFilled &&
      !errors?.foodRecipeName &&
      !emptyMeals &&
      !addFoodWeightErrors &&
      !isAddFoodListEmply
        ? true
        : false;

    return result;
  };

  return (
    <section className="flex-grow-100 w-full flex flex-col flex-wrap justify-center items-center mb-3">
      <h2 className="mt-4 mb-3">Новая запись</h2>

      <div className="group relative w-full max-w-5xl">
        <div className="box_style"></div>
        <form
          className="box_content_transition flex flex-col flex-wrap justify-center w-full px-7 pt-5 pb-8"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="text-xl w-full flex-grow">
            <InputIlluminated
              id={"FoodRecipeCreateForm_foodRecipeName"}
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
                className={
                  errors.foodRecipeName ? "text-pink-500 " : " hidden "
                }
              >
                {errors.foodRecipeName?.message}
              </p>
            </div>
          )}

          <div className="flex flex-col">
            <h3 className="text-xl my-3">Ингредиенты:</h3>

            {addFoodListFields.map((select, index) => {
              return (
                <div
                  key={`FoodRecipeCreateForm_Div_addFoodList_${select.id}_${index}`}
                  className="form-control flex flex-col"
                >
                  <div className="gap-x-3 flex mb-1">
                    <div className="flex flex-col justify-center gap-3 flex-grow mb-3">
                      <span className="flex gap-x-1">
                        <h3>Ингредиент</h3>
                        <p className="text-red">*</p>
                      </span>
                      <Controller
                        key={`FoodRecipeCreateForm_Controller_addFoodList_${select.id}_${index}`}
                        name={`addFoodList.${index}.foodInfo` as const}
                        control={control}
                        render={({ field }) => (
                          <AsyncSelect
                            {...field}
                            key={`FoodRecipeCreateForm_AsyncSelect_addFoodList_${select.id}_${index}`}
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
                        id={`FoodRecipeCreateForm_addFoodList.${index}.weight`}
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
                        isDisabled={addFoodListFields.length > 1 ? false : true}
                      />
                    </div>
                  </div>

                  {errors.addFoodList && (
                    <div
                      className={
                        Object.keys(errors).length > 0 &&
                        errors.addFoodList[index]
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

          <div className="mt-9">
            <ButtonIlluminated
              label="Сохранить"
              isDarkButton={true}
              isIlluminationFull={false}
              isButton={true}
              type="submit"
              additionalStyles=""
              isDisabled={checkIfFilledRight() ? false : true}
            />
          </div>
        </form>
      </div>
    </section>
  );
};

export default FoodRecipeCreateForm;
