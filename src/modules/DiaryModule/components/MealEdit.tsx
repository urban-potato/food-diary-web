import { FC, useEffect, useRef, useState } from "react";
import MealTypeOptions from "./MealTypeOptions";
import { editValidationSchema, selectStyles } from "../constants/constants";
import {
  useAddConsumedElementaryMutation,
  useChangeConsumedElementaryWeightMutation,
  useDeleteConsumedElementaryMutation,
  useChangeMealTypeMutation,
} from "../api/meals.api";
import {
  IFoodElementaryItem,
  useGetAllFoodElementaryQuery,
} from "../../FoodElementaryModule";
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import {
  EditMealData,
  IConsumedElementary,
  MealEditProps,
} from "../types/types";
import { yupResolver } from "@hookform/resolvers/yup";
import AsyncSelect from "react-select/async";
import NoOptionsMessage from "../../../components/NoOptionsMessage/NoOptionsMessage";
import InputIlluminated from "../../../ui/InputIlluminated/InputIlluminated";
import ButtonIlluminated from "../../../ui/ButtonIlluminated/ButtonIlluminated";
import { Player } from "@lordicon/react";
import DELETE_ICON from "../../../global/assets/system-regular-39-trash.json";
import Select from "react-select";

const MealEdit: FC<MealEditProps> = ({
  courseMealId,
  originalMealTypeId,
  consumedElementaries,
  setIsEditMode,
}) => {
  const deleteIconPlayerRef = useRef<Player>(null);
  const ICON_SIZE = 28;

  const [selectedMealType, setSelectedMealType] = useState(originalMealTypeId);

  const originalElementariesToRemoveIdsRef = useRef(new Array());

  const [doAddConsumedElementary] = useAddConsumedElementaryMutation();
  const [doChangeConsumedElementaryWeight] =
    useChangeConsumedElementaryWeightMutation();
  const [doDeleteConsumedElementary] = useDeleteConsumedElementaryMutation();
  const [doChangeMealType] = useChangeMealTypeMutation();

  const {
    isLoading: isLoadingGetAllFoodElementary,
    data: dataGetAllFoodElementary,
    error: errorGetAllFoodElementary,
  } = useGetAllFoodElementaryQuery(undefined);

  const loadOptions = (searchValue: string, callback: any) => {
    const filteredData: IFoodElementaryItem[] =
      dataGetAllFoodElementary?.items.filter((item: IFoodElementaryItem) =>
        item.name.toLowerCase().includes(searchValue.toLowerCase())
      );

    const filteredOptions = filteredData.map((item) => {
      return { value: item.id, label: item.name };
    });

    callback(filteredOptions);
  };

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
    getValues,
    control,
    trigger,
  } = useForm<EditMealData>({
    resolver: yupResolver(editValidationSchema),
    mode: "onChange",
  });

  const {
    fields: originalFields,
    append: originalAppend,
    remove: originalRemove,
  } = useFieldArray({
    name: "originalFoodElementaryList",
    control,
  });

  const {
    fields: newFields,
    append: newAppend,
    remove: newRemove,
  } = useFieldArray({
    name: "foodElementaryList",
    control,
  });

  const handleRemoveOriginalElementary = (itemIndex: number) => {
    originalElementariesToRemoveIdsRef.current.push(
      getValues(
        `originalFoodElementaryList.${itemIndex}.foodElementaryId.value`
      )
    );

    originalRemove(itemIndex);
  };

  const onSubmit: SubmitHandler<EditMealData> = async (data) => {
    const mealType = selectedMealType;
    const newElementaryList = data?.foodElementaryList?.map((item) => {
      return {
        foodElementaryId: item?.foodElementaryId?.value,
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

    const changeMealTypeData = {
      courseMealId: courseMealId,
      data: {
        mealTypeId: mealType,
      },
    };

    doChangeMealType(changeMealTypeData).catch((e) => console.log(e));

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

    for (const foodElementary of newElementaryList) {
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

    for (const elementaryToDeleteId of elementariesIdsToDelete) {
      const deleteConsumedElementaryData = {
        courseMealId: courseMealId,
        foodElementaryId: elementaryToDeleteId,
      };

      doDeleteConsumedElementary(deleteConsumedElementaryData).catch((e) =>
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
    let emptyMeals = getValues("foodElementaryList")?.find(
      (item) => item.foodElementaryId === undefined
    );

    const isBothElementaryListsEmply =
      !getValues("foodElementaryList")?.length &&
      !getValues("originalFoodElementaryList")?.length;

    let newWeightErrors = errors?.foodElementaryList;
    let originalWeightErrors = errors?.originalFoodElementaryList;

    let result =
      !emptyMeals &&
      !newWeightErrors &&
      !originalWeightErrors &&
      !isBothElementaryListsEmply
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
      originalAppend(originalElementary);
    });
  }, []);

  return (
    <form
      className="box_content_transition flex flex-col flex-wrap justify-center w-full px-7 pt-5 pb-8"
      onSubmit={handleSubmit(onSubmit)}
    >
      <MealTypeOptions
        selectedMealType={selectedMealType}
        setSelectedMealType={setSelectedMealType}
      />

      <div className="flex flex-col">
        <h3 className="text-xl my-3">Блюда:</h3>

        {originalFields.map((field, index) => {
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

        {newFields.map((field, index) => {
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
                      `foodElementaryList.${index}.foodElementaryId` as const
                    }
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
                    id={`foodElementaryList.${index}.weight`}
                    type="number"
                    placeholder="Вес (г)"
                    disableIllumination={true}
                    additionalStyles=" h-[67px] border-0 "
                    register={{
                      ...register(
                        `foodElementaryList.${index}.weight` as const
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
                      newRemove(index);
                    }}
                    buttonPadding=" p-[14px] "
                    additionalStyles=" "
                  />
                </div>
              </div>

              {errors.foodElementaryList && (
                <div
                  className={
                    Object.keys(errors).length > 0 &&
                    errors.foodElementaryList[index]
                      ? "flex flex-col mb-2 px-5 gap-y-2 justify-center"
                      : "hidden"
                  }
                >
                  <p
                    className={
                      errors.foodElementaryList[index]?.foodElementaryId?.value
                        ? "text-pink-500 "
                        : " hidden "
                    }
                  >
                    {
                      errors.foodElementaryList[index]?.foodElementaryId?.value
                        ?.message
                    }
                  </p>
                  <p
                    className={
                      errors.foodElementaryList[index]?.weight
                        ? "text-pink-500 "
                        : " hidden "
                    }
                  >
                    {errors.foodElementaryList[index]?.weight?.message}
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
              newAppend({
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

      {/* <div className="mt-9">
        <ButtonIlluminated
          label="Сохранить"
          isDarkButton={true}
          isIlluminationFull={false}
          isButton={true}
          type="submit"
          additionalStyles=""
          isDisabled={checkIfFilledRight() ? false : true}
        />
      </div> */}
    </form>
  );
};

export default MealEdit;
