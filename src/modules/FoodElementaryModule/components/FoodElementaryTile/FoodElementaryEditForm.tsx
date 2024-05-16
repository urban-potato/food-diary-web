import { useChangeFoodElementaryNameMutation } from "../../api/foodElementary.api.ts";
import { editFoodElementaryValidationSchema } from "../../constants/constants.ts";
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
  useFormState,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import { FC, useEffect, useRef } from "react";
import ButtonIlluminated from "../../../../ui/ButtonIlluminated/ButtonIlluminated.tsx";
import InputIlluminated from "../../../../ui/InputIlluminated/InputIlluminated.tsx";
import { Player } from "@lordicon/react";
import DELETE_ICON from "../../../../global/assets/system-regular-39-trash.json";
import {
  useAddFoodCharacteristicMutation,
  useChangeFoodCharacteristicValueMutation,
  useDeleteFoodCharacteristicMutation,
} from "../../api/foodCharacteristic.api.ts";
import {
  IFoodCharacteristic,
  IFoodCharacteristicType,
} from "../../../../global/types/types.ts";
import { useGetAllFoodCharacteristicTypesQuery } from "../../../UserModule/api/foodCharacteristicType.api.ts";
import {
  BASIC_CHARACTERISTICS_IDS_LIST,
  CALORIES_DEFAULT_ID,
  SELECT_STYLES,
} from "../../../../global/constants/constants.ts";
import NoOptionsMessage from "../../../../components/NoOptionsMessage/NoOptionsMessage.tsx";
import DisabledSelectRowWithWeightField from "../../../../components/DisabledSelectRowWithWeightField/DisabledSelectRowWithWeightField.tsx";
import AsyncSelectRowWithWeightField from "../../../../components/AsyncSelectRowWithWeightField/AsyncSelectRowWithWeightField.tsx";

type TProps = {
  foodElementaryId: string;
  foodElementaryName: string;
  originalCharacteristics: IFoodCharacteristic[];
  setIsEditMode: Function;
};

type TFoodElementaryEditFormData = {
  foodElementaryName: string;
  caloriesValue: number;
  addCharacteristicsList: {
    characteristicInfo?: {
      label?: string | undefined;
      value: string;
    };
    characteristicValue: number;
  }[];
  originalCharacteristicsList: {
    characteristicInfo: TOriginalCharacteristic;
    characteristicValue: number;
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

  // const editIconPlayerRef = useRef<Player>(null);
  const deleteIconPlayerRef = useRef<Player>(null);
  const ICON_SIZE = 28;

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

  const originalCaloriesValue = originalCalories?.value ?? 0;

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
          characteristicValue: characteristic.value,
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

    // Change Food Elementary Name
    const foodElementaryNameOnForm = data.foodElementaryName;

    if (foodElementaryNameOnForm != foodElementaryName) {
      const changeFoodElementaryNameData = {
        foodElementaryId: foodElementaryId,
        data: {
          name: foodElementaryNameOnForm,
        },
      };

      await doChangeFoodElementaryName(changeFoodElementaryNameData);

      console.log("Change Food Recipe Name");
    }

    // Change Calories Value
    const caloriesValueOnForm = data.caloriesValue;

    if (caloriesValueOnForm != originalCaloriesValue) {
      const changeCaloriesValueData = {
        foodCharacteristicId: originalCalories?.foodCharacteristicId,
        data: {
          value: caloriesValueOnForm,
        },
      };

      await doChangeFoodCharacteristicValue(changeCaloriesValueData);

      console.log("Change Calories Value");
    }

    // Delete Characteristics
    const characteristicsToDelete = originalCharacteristicsToRemoveRef.current;

    for (const characteristicToDelete of characteristicsToDelete) {
      if (
        !BASIC_CHARACTERISTICS_IDS_LIST.includes(
          characteristicToDelete.characteristicTypeId
        )
      ) {
        await doDeleteFoodCharacteristic(characteristicToDelete.value).catch(
          (e) => console.log(e)
        );

        console.log("Delete Characteristics");
      }
    }

    // Change Characteristics Value
    const originalCharacteristicsOnFormList =
      data?.originalCharacteristicsList?.map((item) => {
        return {
          foodCharacteristicId: item?.characteristicInfo.value,
          value: item?.characteristicValue,
        };
      });

    const characteristicsWithoutDeleted = originalCharacteristics.filter(
      (item) =>
        characteristicsToDelete.find(
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
        characteristicToChange.value != originalCharacteristicOnForm.value
      ) {
        const changeCharacteristicValueData = {
          foodCharacteristicId:
            originalCharacteristicOnForm.foodCharacteristicId,
          data: {
            value: originalCharacteristicOnForm.value,
          },
        };

        await doChangeFoodCharacteristicValue(
          changeCharacteristicValueData
        ).catch((e) => console.log(e));

        console.log("Change Characteristics Value");
      }
    }

    // Add New Characteristics
    const addCharacteristicsList = data?.addCharacteristicsList?.map((item) => {
      return {
        foodElementaryId: foodElementaryId,
        characteristicTypeId: item.characteristicInfo?.value,
        value: item.characteristicValue,
      };
    });

    for (const characteristicToAdd of addCharacteristicsList) {
      await doAddFoodCharacteristic(characteristicToAdd).catch((e) =>
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
      >
        <div className="text-xl w-full flex-grow">
          <InputIlluminated
            id={"FoodElementaryEditForm_foodElementaryName"}
            type="text"
            placeholder="Название блюда"
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
                ? " flex flex-col gap-y-2 justify-center "
                : " hidden "
            }
          >
            <p
              className={
                errors.foodElementaryName ? "text-pink-500 " : " hidden "
              }
            >
              {errors.foodElementaryName?.message}
            </p>
          </div>
        )}

        <div className="text-xl w-full flex-grow mt-2 mb-5">
          <InputIlluminated
            id={"FoodElementaryEditForm_caloriesValue"}
            type="number"
            placeholder="Калорийность (ккал.)"
            disableIllumination={true}
            additionalStyles=" h-[67px] border-0 "
            register={{
              ...register("caloriesValue"),
            }}
            isRequired={true}
            labelSize={"text-lg"}
          />
        </div>
        {errors.caloriesValue && (
          <div
            className={
              Object.keys(errors).length > 0
                ? " flex flex-col gap-y-2 justify-center "
                : " hidden "
            }
          >
            <p className={errors.caloriesValue ? "text-pink-500 " : " hidden "}>
              {errors.caloriesValue?.message}
            </p>
          </div>
        )}

        <div className="flex flex-col">
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
                errors={errors}
                errorsGroup={errors.originalCharacteristicsList}
                errorSelect={
                  errors.originalCharacteristicsList?.[index]
                    ?.characteristicInfo?.value
                }
                errorFeild={
                  errors.originalCharacteristicsList?.[index]
                    ?.characteristicValue
                }
                isDeleteButtonDisabled={index < 3 ? true : false}
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
                errors={errors}
                errorsGroup={errors.addCharacteristicsList}
                errorSelect={
                  errors.addCharacteristicsList?.[index]?.characteristicInfo
                    ?.value
                }
                errorFeild={
                  errors.addCharacteristicsList?.[index]?.characteristicValue
                }
                loadSelectOptions={loadOptions}
                handleOnSelectInputChange={handleOnInputChange}
                handleOnSelectValueChange={handleOnChange}
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
                  characteristicValue: 0,
                });
              }}
              buttonPadding=" p-[12px] "
              additionalStyles=""
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
    </div>
  );
};

export default FoodElementaryEditForm;
