import { FC, useEffect, useRef } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { useCreateFoodElementaryMutation } from "../api/foodElementary.api";
import InputIlluminated from "../../../ui/InputIlluminated/InputIlluminated.tsx";
import ButtonIlluminated from "../../../ui/ButtonIlluminated/ButtonIlluminated.tsx";
import { createFoodElementaryValidationSchema } from "../constants/constants.ts";
import { useAddFoodCharacteristicMutation } from "../api/foodCharacteristic.api.ts";
import { useGetAllFoodCharacteristicTypesQuery } from "../../UserModule/api/foodCharacteristicType.api.ts";
import { IFoodCharacteristicType } from "../../../global/types/types.ts";
import {
  BASIC_CHARACTERISTICS_IDS_LIST,
  CALORIES_DEFAULT_ID,
  CARBOHYDRATE_DEFAULT_ID,
  FAT_DEFAULT_ID,
  PROTEIN_DEFAULT_ID,
} from "../../../global/constants/constants.ts";
import { sortConsumedCharacteristics } from "../../../global/helpers/sort_characteristics.helper.ts";
import DisabledSelectRowWithWeightField from "../../../components/DisabledSelectRowWithWeightField/DisabledSelectRowWithWeightField.tsx";
import AsyncSelectRowWithWeightField from "../../../components/AsyncSelectRowWithWeightField/AsyncSelectRowWithWeightField.tsx";

type TProps = {
  setShowCreateForm: Function;
};

type TFoodElementaryCreateFormData = {
  foodElementaryName: string;
  caloriesValue: number;
  addCharacteristicsList: {
    characteristicInfo?: {
      label?: string | undefined;
      value: string;
    };
    characteristicValue: number;
  }[];
  defaultCharacteristicsList: {
    characteristicInfo: {
      label: string;
      value: string;
    };
    characteristicValue: number;
  }[];
};

type TSelectElement = {
  label: string;
  value: string;
};

const FoodElementaryCreateForm: FC<TProps> = ({ setShowCreateForm }) => {
  const newCharacteristicsForbiddenToAddIdsRef = useRef<Array<String>>(
    new Array()
  );

  const [doCreateFoodElementary] = useCreateFoodElementaryMutation();
  const [doAddFoodCharacteristic] = useAddFoodCharacteristicMutation();

  // Food Characteristics Types for Async Select
  const {
    isLoading: isLoadingGetAllFoodCharacteristicTypes,
    data: dataGetAllFoodCharacteristicTypes,
    error: errorGetAllFoodCharacteristicTypes,
    isSuccess: isSuccessGetAllFoodCharacteristicTypes,
  } = useGetAllFoodCharacteristicTypesQuery(undefined);

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
        !newCharacteristicsForbiddenToAddIdsRef.current.includes(item.value) &&
        !BASIC_CHARACTERISTICS_IDS_LIST.includes(item.value)
    );

    callback(filteredOptions);
  };

  // defaultValues
  let defaultValues = {
    caloriesValue: 0,
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
  } = useForm<TFoodElementaryCreateFormData>({
    resolver: yupResolver(createFoodElementaryValidationSchema),
    mode: "onChange",
    defaultValues: defaultValues,
  });

  // For Generating Default Characteristic Fields
  const {
    fields: defaultCharacteristicsFields,
    append: defaultaracteristicsAppend,
    remove: defaultCharacteristicsRemove,
  } = useFieldArray({
    name: "defaultCharacteristicsList",
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

  const handleRemoveCharacteristicToAdd = (itemIndex: number) => {
    if (
      itemIndex > -1 &&
      itemIndex < newCharacteristicsForbiddenToAddIdsRef.current.length
    ) {
      newCharacteristicsForbiddenToAddIdsRef.current.splice(itemIndex, 1);
    }

    addCharacteristicListRemove(itemIndex);
  };

  const onSubmit: SubmitHandler<TFoodElementaryCreateFormData> = async (
    data
  ) => {
    console.log("==========================================");
    console.log("data", data);

    const defaultCharacteristics = data.defaultCharacteristicsList;
    const additionalCharacteristics = data.addCharacteristicsList;

    // Create Food Elementary
    const createFoodElementaryData = {
      name: data.foodElementaryName,
      proteinValue: 0,
      fatValue: 0,
      carbohydrateValue: 0,
      caloriesValue: data.caloriesValue,
    };

    for (const defaultCharacteristic of defaultCharacteristics) {
      switch (defaultCharacteristic.characteristicInfo?.value) {
        case PROTEIN_DEFAULT_ID:
          createFoodElementaryData.proteinValue =
            defaultCharacteristic.characteristicValue;
          break;
        case FAT_DEFAULT_ID:
          createFoodElementaryData.fatValue =
            defaultCharacteristic.characteristicValue;
          break;
        case CARBOHYDRATE_DEFAULT_ID:
          createFoodElementaryData.carbohydrateValue =
            defaultCharacteristic.characteristicValue;
          break;
        default:
          break;
      }
    }

    await doCreateFoodElementary(createFoodElementaryData)
      .unwrap()
      .then(async (responseFoodElementaryId) => {
        console.log("Create Food Elementary");

        for (const characteristic of additionalCharacteristics) {
          const addCharacteristicData = {
            foodElementaryId: responseFoodElementaryId,
            characteristicTypeId: characteristic.characteristicInfo?.value,
            value: characteristic.characteristicValue,
          };

          await doAddFoodCharacteristic(addCharacteristicData).catch((e) =>
            console.log(e)
          );

          console.log("Add Additional Characteristics");
        }
      })
      .catch((e) => console.log(e));

    reset();

    // Reset Async Select Field,
    // because it stays the same if there was only one
    if (addCharacteristicListFields.length === 1) {
      addCharacteristicListRemove(0);
      addCharacteristicListAppend({
        characteristicValue: 0,
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
    if (isSuccessGetAllFoodCharacteristicTypes) {
      const defaultCharacteristics: IFoodCharacteristicType[] =
        dataGetAllFoodCharacteristicTypes?.items.filter(
          (item: IFoodCharacteristicType) =>
            BASIC_CHARACTERISTICS_IDS_LIST.includes(item.id) &&
            item.id != CALORIES_DEFAULT_ID
        );

      const sortedDefaultCharacteristics: IFoodCharacteristicType[] =
        sortConsumedCharacteristics(defaultCharacteristics);

      const defaultCharacteristicsOnForm = sortedDefaultCharacteristics?.map(
        (characteristic: IFoodCharacteristicType) => {
          return {
            characteristicInfo: {
              label: characteristic.name,
              value: characteristic.id,
            },
            characteristicValue: 0,
          };
        }
      );

      defaultCharacteristicsOnForm?.forEach((defaultCharacteristic) => {
        defaultaracteristicsAppend(defaultCharacteristic);
      });
    }
  }, [dataGetAllFoodCharacteristicTypes]);

  const handleAddNutrient = () => {
    newCharacteristicsForbiddenToAddIdsRef.current.push("");

    addCharacteristicListAppend({
      characteristicValue: 0,
    });
  };

  return (
    <section className="flex-grow-100 w-full flex flex-col flex-wrap justify-center items-center mb-3">
      <h2 className="mt-4 mb-3">Создать простое блюдо</h2>

      <div className="outer_box_style group w-full max-w-5xl mt-5">
        <div className="box_style"></div>
        <form
          className="box_content_transition flex flex-col flex-wrap w-full justify-center p-7"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="text-xl w-full flex-grow">
            <InputIlluminated
              id={"FoodElementaryCreateForm_foodElementaryName"}
              type="text"
              placeholder="Название блюда"
              disableIllumination={true}
              additionalStyles=" h-[67px] border-0 "
              register={{
                ...register("foodElementaryName"),
              }}
              isRequired={true}
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
              id={"FoodElementaryCreateForm_caloriesValue"}
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
              <p
                className={errors.caloriesValue ? "text-pink-500 " : " hidden "}
              >
                {errors.caloriesValue?.message}
              </p>
            </div>
          )}

          <div className="flex flex-col">
            {defaultCharacteristicsFields.map((item, index) => {
              return (
                <DisabledSelectRowWithWeightField
                  key={`FoodElementaryCreateForm_div_defaultCharacteristicsFields_${item.id}_${index}`}
                  itemId={item.id}
                  itemIndex={index}
                  label={"Нутриент"}
                  selectPlaceholder={"Введите название нутриента"}
                  handleRemoveItem={(_) => {}}
                  controllerName={
                    `defaultCharacteristicsList.${index}.characteristicInfo` as const
                  }
                  control={control}
                  register={{
                    ...register(
                      `defaultCharacteristicsList.${index}.characteristicValue` as const
                    ),
                  }}
                  errors={errors}
                  errorsGroup={errors.defaultCharacteristicsList}
                  errorSelect={
                    errors.defaultCharacteristicsList?.[index]
                      ?.characteristicInfo?.value
                  }
                  errorFeild={
                    errors.defaultCharacteristicsList?.[index]
                      ?.characteristicValue
                  }
                  isDeleteButtonDisabled={true}
                />
              );
            })}

            {addCharacteristicListFields.map((item, index) => {
              return (
                <AsyncSelectRowWithWeightField
                  key={`FoodElementaryCreateForm_Div_addCharacteristicsList_${item.id}_${index}`}
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
                onClick={() => handleAddNutrient()}
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

export default FoodElementaryCreateForm;
