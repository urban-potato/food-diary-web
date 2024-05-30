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
} from "../../../../global/constants/constants.ts";
import DisabledSelectRowWithWeightField from "../../../../components/DisabledSelectRowWithWeightField/DisabledSelectRowWithWeightField.tsx";
import AsyncSelectRowWithWeightField from "../../../../components/AsyncSelectRowWithWeightField/AsyncSelectRowWithWeightField.tsx";
import { replaceIncorrectDecimal } from "../../../../global/helpers/replace-incorrect-decimal.helper.ts";

type TProps = {
  foodElementaryId: string;
  foodElementaryName: string;
  originalCharacteristics: IFoodCharacteristic[];
  setIsEditMode: Function;
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
    error: errorGetAllFoodCharacteristicTypes,
  } = useGetAllFoodCharacteristicTypesQuery(undefined);

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
    formState: { errors },
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

  let checkIfFilledRight = () => {
    let foodElementaryNameFilled = getValues("foodElementaryName");
    let caloriesValueFilled = getValues("caloriesValue").toString();
    let emptyCharacteristics = getValues("addCharacteristicsList")?.find(
      (item) => item.characteristicInfo === undefined
    );

    const isAllCharacteristicsListsEmply =
      !getValues("addCharacteristicsList")?.length &&
      !getValues("originalCharacteristicsList")?.length;

    let addCharacteristicValueErrors = errors?.addCharacteristicsList;
    let originalCharacteristicValueErrors = errors?.originalCharacteristicsList;

    let result =
      foodElementaryNameFilled &&
      !errors?.foodElementaryName &&
      caloriesValueFilled &&
      !errors?.caloriesValue &&
      !emptyCharacteristics &&
      !addCharacteristicValueErrors &&
      !originalCharacteristicValueErrors &&
      !isAllCharacteristicsListsEmply
        ? true
        : false;

    return result;
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
    console.log("\nFoodElementaryEditForm Submit\n");
    console.log("data", data);

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

        console.log("Push in Change Characteristics Values List");
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

      await doChangeFoodElementaryName(changeFoodElementaryNameData);

      console.log("Change Food Recipe Name");
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

      await doChangeFoodCharacteristicValue(changeCaloriesValueData);

      console.log("Change Calories Value");
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
        await doDeleteFoodCharacteristic(deleteFoodCharacteristicData).catch(
          (e) => console.log(e)
        );

        console.log("Delete Characteristics");
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

      await doChangeFoodCharacteristicValue(
        changeCharacteristicValueData
      ).catch((e) => console.log(e));

      console.log("Change Characteristics Value");
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

      await doAddFoodCharacteristic(addCharacteristicData).catch((e) =>
        console.log(e)
      );

      console.log("Add New Characteristics");
    }

    reset();

    setIsEditMode(false);
  };

  return (
    <div className="w-full max-w-5xl flex flex-col justify-center items-start -mt-5">
      <form
        className="flex flex-col flex-wrap justify-center w-full"
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
      >
        <div className="text-xl w-full flex-grow">
          <InputIlluminated
            id={"FoodElementaryEditForm_foodElementaryName"}
            type="text"
            inputLabel="Название блюда"
            disableIllumination={true}
            additionalStyles=" h-[67px] border-0 "
            register={{
              ...register("foodElementaryName"),
            }}
            isRequired={true}
            addSpaceAfterLabel={true}
            labelSize={"text-lg"}
          />
        </div>

        {errors.foodElementaryName && (
          <div
            className={
              Object.keys(errors).length > 0
                ? "flex flex-col mt-1 justify-center items-start"
                : "hidden"
            }
          >
            <p
              className={errors.foodElementaryName ? "text-pink-500" : "hidden"}
            >
              {errors.foodElementaryName?.message}
            </p>
          </div>
        )}

        <div className="text-xl w-full flex-grow mt-2">
          <InputIlluminated
            id={"FoodElementaryEditForm_caloriesValue"}
            type="text"
            inputLabel="Калорийность (ккал.)"
            disableIllumination={true}
            additionalStyles=" h-[67px] border-0 "
            register={{
              ...register("caloriesValue"),
            }}
            isRequired={true}
            labelSize={"text-lg"}
            onInput={(event: ChangeEvent<HTMLInputElement>) => {
              const isValidInput = DECIMAL_REGEX.test(event.target.value);

              if (!isValidInput) {
                event.target.value = replaceIncorrectDecimal(
                  event.target.value
                );
              }
            }}
          />
        </div>
        {errors.caloriesValue && (
          <div
            className={
              Object.keys(errors).length > 0
                ? "flex flex-col mt-1 justify-center items-start"
                : "hidden"
            }
          >
            <p className={errors.caloriesValue ? "text-pink-500" : "hidden"}>
              {errors.caloriesValue?.message}
            </p>
          </div>
        )}

        <div className="flex flex-col mt-5">
          {originalCharacteristicsFields.map((item, index) => {
            return (
              <DisabledSelectRowWithWeightField
                key={`FoodElementaryEditForm_div_originalCharacteristicsFields_${item.id}_${index}`}
                itemId={item.id}
                itemIndex={index}
                label={"Нутриент"}
                selectPlaceholder={"Введите название нутриента"}
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
                selectPlaceholder={"Введите название нутриента"}
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
                    errors?.addCharacteristicsList?.[index]?.characteristicInfo
                      ?.value?.message,
                    errors?.addCharacteristicsList?.[index]?.characteristicValue
                      ?.message,
                  ].filter((item) => !!item) as string[]
                }
              />
            );
          })}

          <div className="w-full max-w-[280px] mt-3">
            <ButtonIlluminated
              label={"Добавить нутриент"}
              isDarkButton={true}
              isIlluminationFull={false}
              onClick={() => {
                newCharacteristicsForbiddenToAddIdsRef.current.push("");

                addCharacteristicListAppend({
                  characteristicValue: "0",
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

export default FoodElementaryEditForm;
