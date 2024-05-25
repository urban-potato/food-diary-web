import { FC, useEffect, useRef } from "react";
import {
  useAddElementaryMutation,
  useCreateFoodRecipeMutation,
} from "../api/foodRecipe.api";
import { useGetAllFoodElementaryQuery } from "../../FoodElementaryModule";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { createFoodRecipeValidationSchema } from "../constants/constants";
import InputIlluminated from "../../../ui/InputIlluminated/InputIlluminated";
import ButtonIlluminated from "../../../ui/ButtonIlluminated/ButtonIlluminated";
import { IFoodElementary } from "../../../global/types/types";
import AsyncSelectRowWithWeightField from "../../../components/AsyncSelectRowWithWeightField/AsyncSelectRowWithWeightField";

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

  const handleAddSelect = () => {
    newFoodForbiddenToAddIdsRef.current.push("");

    addFoodListAppend({
      weight: 0,
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
              <p className={errors.foodRecipeName ? "text-pink-500" : "hidden"}>
                {errors.foodRecipeName?.message}
              </p>
            </div>
          )}

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
                  errors={errors}
                  errorsGroup={errors.addFoodList}
                  errorSelect={errors.addFoodList?.[index]?.foodInfo?.value}
                  errorFeild={errors.addFoodList?.[index]?.weight}
                  loadSelectOptions={loadOptions}
                  handleOnSelectInputChange={handleOnInputChange}
                  handleOnSelectValueChange={handleOnChange}
                  isDeleteButtonDisabled={
                    addFoodListFields.length < 2 ? true : false
                  }
                />
              );
            })}

            <div className="w-full max-w-[280px] mt-3">
              <ButtonIlluminated
                label={"Еще одно блюдо"}
                isDarkButton={true}
                isIlluminationFull={false}
                onClick={() => {
                  handleAddSelect();
                }}
                buttonPadding=" p-[12px] "
                additionalStyles=""
                isIttuminationDisabled={true}
              />
            </div>
          </div>

          <div className="mt-5">
            <ButtonIlluminated
              label="Сохранить"
              isDarkButton={true}
              isIlluminationFull={false}
              isButton={true}
              type="submit"
              additionalStyles=""
              isIttuminationDisabled={true}
            />
          </div>
        </form>
      </div>
    </section>
  );
};

export default FoodRecipeCreateForm;
