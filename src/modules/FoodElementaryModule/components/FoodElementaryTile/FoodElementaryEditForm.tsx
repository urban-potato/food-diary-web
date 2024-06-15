import { useChangeFoodElementaryNameMutation } from "../../api/food-elementary.api.ts";
import { editFoodElementaryValidationSchema } from "../../constants/FoodElementaryModule.constants.ts";
import {
  SubmitHandler,
  useFieldArray,
  useForm,
  useFormState,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ChangeEvent, FC, useEffect, useRef } from "react";
import ButtonIlluminated from "../../../../ui/ButtonIlluminated/ButtonIlluminated.tsx";
import InputIlluminated from "../../../../ui/InputIlluminated/InputIlluminated.tsx";
import {
  useAddFoodCharacteristicMutation,
  useChangeFoodCharacteristicValueMutation,
  useDeleteFoodCharacteristicMutation,
} from "../../api/food-characteristic.api.ts";
import {
  IFoodCharacteristic,
  IFoodCharacteristicType,
} from "../../../../global/types/entities-types.ts";
import { useGetAllFoodCharacteristicTypesQuery } from "../../../FoodCharacteristicTypesInfoTile/api/food-characteristic-type.api.ts";
import {
  BASIC_CHARACTERISTICS_IDS_LIST,
  CALORIES_DEFAULT_ID,
  DECIMAL_REGEX,
  ROUTES_LIST,
} from "../../../../global/constants/constants.ts";
import DisabledSelectRowWithWeightField from "../../../../components/DisabledSelectRowWithWeightField/DisabledSelectRowWithWeightField.tsx";
import AsyncSelectRowWithWeightField from "../../../../components/AsyncSelectRowWithWeightField/AsyncSelectRowWithWeightField.tsx";
import { replaceIncorrectDecimal } from "../../../../global/helpers/replace-incorrect-decimal.helper.ts";
import { handleApiCallError } from "../../../../global/helpers/handle-api-call-error.helper.ts";
import { useAppDispatch } from "../../../../global/store/store-hooks.ts";
import { useNavigate } from "react-router-dom";
import Preloader from "../../../../components/Preloader/Preloader.tsx";
import { compareLabels } from "../../../../global/helpers/compare-labels.helper.ts";

type TProps = {
  foodElementaryId: string;
  foodElementaryName: string;
  originalCharacteristics: IFoodCharacteristic[];
  setIsEditMode: Function;
  isEditMode: boolean;
  setMainIsLoading: Function;
};

type TFoodElementaryEditFormData = {
  foodElementaryName: string;
  caloriesValue: string;
  addCharacteristicsList: {
    characteristicInfo?: {
      label?: string | undefined;
      value: string;
    };
    characteristicValue: string;
  }[];
  originalCharacteristicsList: {
    characteristicInfo: TOriginalCharacteristic;
    characteristicValue: string;
  }[];
};

type TOriginalCharacteristic = {
  label: string | undefined;
  value: string;
  characteristicTypeId: string;
};

type TSelectElement = {
  label: string;
  value: string;
};

const FoodElementaryEditForm: FC<TProps> = ({
  foodElementaryId,
  foodElementaryName,
  originalCharacteristics,
  setIsEditMode,
  isEditMode,
  setMainIsLoading,
}) => {
  // Characteristics forbidden to add
  const characteristicsForbiddenToAddIdsRef = useRef<Array<String>>(
    new Array()
  );
  const newCharacteristicsForbiddenToAddIdsRef = useRef<Array<String>>(
    new Array()
  );
  // Characteristics to delete
  const originalCharacteristicsToRemoveRef = useRef<
    Array<TOriginalCharacteristic>
  >(new Array());

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Edit Food Elementary
  const [doChangeFoodElementaryName] = useChangeFoodElementaryNameMutation();

  // Edit Food Characteristic
  const [doAddFoodCharacteristic] = useAddFoodCharacteristicMutation();
  const [doChangeFoodCharacteristicValue] =
    useChangeFoodCharacteristicValueMutation();
  const [doDeleteFoodCharacteristic] = useDeleteFoodCharacteristicMutation();

  const originalCalories = originalCharacteristics.find(
    (item) => item.characteristicTypeId === CALORIES_DEFAULT_ID
  );

  const originalCaloriesValue = originalCalories?.value.toString() ?? "0";

  // Food Characteristics Types for Async Select
  const {
    isLoading: isLoadingGetAllFoodCharacteristicTypes,
    data: dataGetAllFoodCharacteristicTypes,
    isError: isErrorGetAllFoodCharacteristicTypes,
    error: errorGetAllFoodCharacteristicTypes,
  } = useGetAllFoodCharacteristicTypesQuery(undefined);

  if (
    isErrorGetAllFoodCharacteristicTypes &&
    errorGetAllFoodCharacteristicTypes &&
    "status" in errorGetAllFoodCharacteristicTypes
  ) {
    handleApiCallError({
      error: errorGetAllFoodCharacteristicTypes,
      dispatch: dispatch,
      navigate: navigate,
    });
  }

  // defaultValues
  let defaultValues = {
    foodElementaryName: foodElementaryName,
    caloriesValue: originalCaloriesValue,
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
  } = useForm<TFoodElementaryEditFormData>({
    resolver: yupResolver(editFoodElementaryValidationSchema),
    mode: "onChange",
    defaultValues: defaultValues,
  });

  const { dirtyFields, touchedFields } = useFormState({ control });

  // Load Options for Async Select (Add new CHaracteristic)
  const loadOptions = (searchValue: string, callback: any) => {
    const filteredCharacteristicTypesData: IFoodCharacteristicType[] =
      dataGetAllFoodCharacteristicTypes?.items.filter(
        (item: IFoodCharacteristicType) =>
          item.name.toLowerCase().includes(searchValue.toLowerCase())
      );

    const filteredCharacteristicTypesOptions =
      filteredCharacteristicTypesData.map((item) => {
        return { value: item.id, label: item.name };
      });

    const filteredOptions = filteredCharacteristicTypesOptions.filter(
      (item) =>
        !characteristicsForbiddenToAddIdsRef.current.includes(item.value) &&
        !newCharacteristicsForbiddenToAddIdsRef.current.includes(item.value) &&
        item.value != CALORIES_DEFAULT_ID
    );

    filteredOptions.sort(compareLabels);

    callback(filteredOptions);
  };

  // For Generating Original Characteristic Fields
  const {
    fields: originalCharacteristicsFields,
    append: originalCharacteristicsAppend,
    remove: originalCharacteristicsRemove,
  } = useFieldArray({
    name: "originalCharacteristicsList",
    control,
  });

  // For Generating Add Characteristic Fields
  const {
    fields: addCharacteristicListFields,
    append: addCharacteristicListAppend,
    remove: addCharacteristicListRemove,
  } = useFieldArray({
    name: "addCharacteristicsList",
    control,
  });

  const handleRemoveOriginalCharacteristic = (itemIndex: number) => {
    const characteristic = getValues(
      `originalCharacteristicsList.${itemIndex}.characteristicInfo`
    );

    if (
      BASIC_CHARACTERISTICS_IDS_LIST.includes(
        characteristic.characteristicTypeId
      )
    ) {
      return;
    }

    originalCharacteristicsToRemoveRef.current.push(characteristic);

    const indexInCharacteristicsForbiddenToAddIdsRef =
      characteristicsForbiddenToAddIdsRef.current.indexOf(
        characteristic.characteristicTypeId
      );

    if (indexInCharacteristicsForbiddenToAddIdsRef > -1) {
      characteristicsForbiddenToAddIdsRef.current.splice(
        indexInCharacteristicsForbiddenToAddIdsRef,
        1
      );
    }

    originalCharacteristicsRemove(itemIndex);
  };

  const handleRemoveCharacteristicToAdd = (itemIndex: number) => {
    if (
      itemIndex > -1 &&
      itemIndex < newCharacteristicsForbiddenToAddIdsRef.current.length
    ) {
      newCharacteristicsForbiddenToAddIdsRef.current.splice(itemIndex, 1);
    }

    addCharacteristicListRemove(itemIndex);
  };

  const handleOnInputChange = () => {
    trigger();
  };

  const handleOnChange = (newElement: TSelectElement, addFoodIndex: number) => {
    if (
      addFoodIndex > -1 &&
      addFoodIndex < newCharacteristicsForbiddenToAddIdsRef.current.length
    ) {
      newCharacteristicsForbiddenToAddIdsRef.current.splice(
        addFoodIndex,
        1,
        newElement.value
      );
    }
  };

  useEffect(() => {
    const originalCharacteristicsOnForm = originalCharacteristics.map(
      (characteristic: IFoodCharacteristic) => {
        return {
          characteristicInfo: {
            label: characteristic.characteristicName,
            value: characteristic.foodCharacteristicId,
            characteristicTypeId: characteristic.characteristicTypeId,
          },
          characteristicValue: characteristic.value.toString(),
        };
      }
    );

    originalCharacteristicsOnForm.forEach((originalCharacteristic) => {
      if (
        originalCharacteristic.characteristicInfo.characteristicTypeId !=
        CALORIES_DEFAULT_ID
      ) {
        originalCharacteristicsAppend(originalCharacteristic);
      }

      characteristicsForbiddenToAddIdsRef.current.push(
        originalCharacteristic.characteristicInfo.characteristicTypeId
      );
    });
  }, []);

  useEffect(() => {
    if (Object.keys(dirtyFields).length && !Object.keys(touchedFields).length) {
      trigger();
    }
  }, [dirtyFields, touchedFields]);

  const onSubmit: SubmitHandler<TFoodElementaryEditFormData> = async (data) => {
    setMainIsLoading(true);

    const foodElementaryNameOnForm = data.foodElementaryName;
    const caloriesValueOnForm = data.caloriesValue;

    const isChangeNameNeeded = foodElementaryNameOnForm != foodElementaryName;
    const isChangeCaloriesNeeded = caloriesValueOnForm != originalCaloriesValue;

    // Delete Characteristics List
    const deleteCharacteristicsList =
      originalCharacteristicsToRemoveRef.current;

    // Change Characteristics Values List
    let changeCharacteristicsValuesList = [];

    const originalCharacteristicsOnFormList =
      data?.originalCharacteristicsList?.map((item) => {
        return {
          foodCharacteristicId: item?.characteristicInfo.value,
          value: item?.characteristicValue,
        };
      });

    const characteristicsWithoutDeleted = originalCharacteristics.filter(
      (item) =>
        deleteCharacteristicsList.find(
          (characteristic) => characteristic.value == item.foodCharacteristicId
        ) == undefined
    );

    for (const originalCharacteristicOnForm of originalCharacteristicsOnFormList) {
      const characteristicToChange = characteristicsWithoutDeleted.find(
        (item) =>
          item.foodCharacteristicId ==
          originalCharacteristicOnForm.foodCharacteristicId
      );

      if (
        characteristicToChange != undefined &&
        characteristicToChange.value.toString() !=
          originalCharacteristicOnForm.value
      ) {
        changeCharacteristicsValuesList.push(originalCharacteristicOnForm);
      }
    }

    // Add Characteristics List
    const addCharacteristicsList = data?.addCharacteristicsList?.map((item) => {
      return {
        data: {
          foodElementaryId: foodElementaryId,
          characteristicTypeId: item.characteristicInfo?.value,
          value: item.characteristicValue,
        },
      };
    });

    // Change Food Elementary Name
    if (isChangeNameNeeded) {
      const changeFoodElementaryNameData = {
        foodElementaryId: foodElementaryId,
        data: {
          name: foodElementaryNameOnForm,
        },
        isInvalidationNeeded:
          deleteCharacteristicsList.length +
            changeCharacteristicsValuesList.length +
            addCharacteristicsList.length >
            0 || isChangeCaloriesNeeded
            ? false
            : true,
      };

      await doChangeFoodElementaryName(changeFoodElementaryNameData)
        .unwrap()
        .catch((error) => {
          handleApiCallError({
            error: error,
            dispatch: dispatch,
            navigate: navigate,
          });
        });
    }

    // Change Calories Value
    if (isChangeCaloriesNeeded) {
      const changeCaloriesValueData = {
        foodCharacteristicId: originalCalories?.foodCharacteristicId,
        data: {
          value: caloriesValueOnForm,
        },
        isInvalidationNeeded:
          deleteCharacteristicsList.length +
            changeCharacteristicsValuesList.length +
            addCharacteristicsList.length >
          0
            ? false
            : true,
      };

      await doChangeFoodCharacteristicValue(changeCaloriesValueData)
        .unwrap()
        .catch((error) => {
          handleApiCallError({
            error: error,
            dispatch: dispatch,
            navigate: navigate,
          });
        });
    }

    // Delete Characteristics
    for (const [
      index,
      characteristicToDelete,
    ] of deleteCharacteristicsList.entries()) {
      if (
        !BASIC_CHARACTERISTICS_IDS_LIST.includes(
          characteristicToDelete.characteristicTypeId
        )
      ) {
        const deleteFoodCharacteristicData = {
          foodCharacteristicId: characteristicToDelete.value,
          isInvalidationNeeded:
            index == deleteCharacteristicsList.length - 1 &&
            changeCharacteristicsValuesList.length +
              addCharacteristicsList.length ==
              0
              ? true
              : false,
        };
        await doDeleteFoodCharacteristic(deleteFoodCharacteristicData)
          .unwrap()
          .catch((error) => {
            handleApiCallError({
              error: error,
              dispatch: dispatch,
              navigate: navigate,
            });
          });
      }
    }

    // Change Characteristics Value
    for (const [
      index,
      originalCharacteristicOnForm,
    ] of changeCharacteristicsValuesList.entries()) {
      const changeCharacteristicValueData = {
        foodCharacteristicId: originalCharacteristicOnForm.foodCharacteristicId,
        data: {
          value: originalCharacteristicOnForm.value,
        },
        isInvalidationNeeded:
          index == changeCharacteristicsValuesList.length - 1 &&
          addCharacteristicsList.length == 0
            ? true
            : false,
      };

      await doChangeFoodCharacteristicValue(changeCharacteristicValueData)
        .unwrap()
        .catch((error) => {
          handleApiCallError({
            error: error,
            dispatch: dispatch,
            navigate: navigate,
          });
        });
    }

    // Add New Characteristics
    for (const [
      index,
      characteristicToAdd,
    ] of addCharacteristicsList.entries()) {
      const addCharacteristicData = {
        ...characteristicToAdd,
        isInvalidationNeeded:
          index == addCharacteristicsList.length - 1 ? true : false,
      };

      await doAddFoodCharacteristic(addCharacteristicData)
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
        {isLoadingGetAllFoodCharacteristicTypes ? (
          <div className="flex justify-center items-center">
            <Preloader />
          </div>
        ) : (
          <>
            <div className="text-xl w-full flex-grow">
              <InputIlluminated
                id={"FoodElementaryEditForm_foodElementaryName"}
                type="text"
                inputLabel="Название блюда"
                register={{
                  ...register("foodElementaryName"),
                }}
                isRequired={true}
                className="h-[67px]"
                labelClassName="text-lg"
                isError={!!errors?.foodElementaryName}
                errorMessagesList={
                  [errors?.foodElementaryName?.message].filter(
                    (item) => !!item
                  ) as string[]
                }
              />
            </div>

            <div className="text-xl w-full flex-grow mt-2">
              <InputIlluminated
                id={"FoodElementaryEditForm_caloriesValue"}
                type="text"
                inputLabel="Килокалории на 100 г"
                register={{
                  ...register("caloriesValue"),
                }}
                isRequired={true}
                onInput={(event: ChangeEvent<HTMLInputElement>) => {
                  const isValidInput = DECIMAL_REGEX.test(event.target.value);

                  if (!isValidInput) {
                    event.target.value = replaceIncorrectDecimal(
                      event.target.value
                    );
                  }
                }}
                className="h-[67px]"
                labelClassName="text-lg"
                isError={!!errors?.caloriesValue}
                errorMessagesList={
                  [errors?.caloriesValue?.message].filter(
                    (item) => !!item
                  ) as string[]
                }
              />
            </div>

            <div className="flex flex-col mt-5">
              {originalCharacteristicsFields.map((item, index) => {
                return (
                  <DisabledSelectRowWithWeightField
                    key={`FoodElementaryEditForm_div_originalCharacteristicsFields_${item.id}_${index}`}
                    itemId={item.id}
                    itemIndex={index}
                    label={"Нутриент"}
                    selectPlaceholder={"Название..."}
                    handleRemoveItem={handleRemoveOriginalCharacteristic}
                    controllerName={
                      `originalCharacteristicsList.${index}.characteristicInfo` as const
                    }
                    control={control}
                    register={{
                      ...register(
                        `originalCharacteristicsList.${index}.characteristicValue` as const
                      ),
                    }}
                    isDeleteButtonDisabled={index < 3 ? true : false}
                    hasErrors={!!errors?.originalCharacteristicsList}
                    errorMessagesList={
                      [
                        errors?.originalCharacteristicsList?.[index]
                          ?.characteristicInfo?.value?.message,
                        errors?.originalCharacteristicsList?.[index]
                          ?.characteristicValue?.message,
                      ].filter((item) => !!item) as string[]
                    }
                  />
                );
              })}

              {addCharacteristicListFields.map((item, index) => {
                return (
                  <AsyncSelectRowWithWeightField
                    key={`FoodElementaryEditForm_Div_addCharacteristicsList_${item.id}_${index}`}
                    itemId={item.id}
                    itemIndex={index}
                    label={"Нутриент"}
                    selectPlaceholder={"Название..."}
                    handleRemoveItem={handleRemoveCharacteristicToAdd}
                    controllerName={
                      `addCharacteristicsList.${index}.characteristicInfo` as const
                    }
                    control={control}
                    register={{
                      ...register(
                        `addCharacteristicsList.${index}.characteristicValue` as const
                      ),
                    }}
                    loadSelectOptions={loadOptions}
                    handleOnSelectInputChange={handleOnInputChange}
                    handleOnSelectValueChange={handleOnChange}
                    hasErrors={!!errors?.addCharacteristicsList}
                    errorMessagesList={
                      [
                        errors?.addCharacteristicsList?.[index]
                          ?.characteristicInfo?.value?.message,
                        errors?.addCharacteristicsList?.[index]
                          ?.characteristicValue?.message,
                      ].filter((item) => !!item) as string[]
                    }
                    linkForNoOptionsMessage={`${ROUTES_LIST.profile}#nutrients`}
                  />
                );
              })}

              <div className="w-full max-w-[280px] mt-3">
                <ButtonIlluminated
                  children={"Добавить нутриент"}
                  type="button"
                  onClick={() => {
                    newCharacteristicsForbiddenToAddIdsRef.current.push("");

                    addCharacteristicListAppend({
                      characteristicValue: "0",
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

export default FoodElementaryEditForm;
