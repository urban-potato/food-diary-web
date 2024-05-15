import { FC, useEffect, useRef } from "react";
import { Player } from "@lordicon/react";
import DELETE_ICON from "../../../global/assets/system-regular-39-trash.json";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
  useFormState,
} from "react-hook-form";
import Select from "react-select";
import AsyncSelect from "react-select/async";
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
  SELECT_STYLES,
  ZERO_CHARACTERISTICS_SUM_DATA,
} from "../../../global/constants/constants.ts";
import NoOptionsMessage from "../../../components/NoOptionsMessage/NoOptionsMessage.tsx";
import { sortConsumedCharacteristics } from "../../../global/helpers/sort_characteristics.helper.ts";

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

  const deleteIconPlayerRef = useRef<Player>(null);
  const ICON_SIZE = 28;

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

  const { dirtyFields, touchedFields } = useFormState({ control });

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

  const checkIfFilledRight = () => {
    const foodElementaryNameFilled = getValues("foodElementaryName");
    const caloriesValueFilled = getValues("caloriesValue").toString();
    const emptyCharacteristics = getValues("addCharacteristicsList")?.find(
      (item) => item.characteristicInfo === undefined
    );

    const isAllCharacteristicsListsEmply =
      !getValues("addCharacteristicsList")?.length &&
      !getValues("defaultCharacteristicsList")?.length;

    let addCharacteristicValueErrors = errors?.addCharacteristicsList;
    let defaultCharacteristicValueErrors = errors?.defaultCharacteristicsList;

    let result =
      foodElementaryNameFilled &&
      !errors?.foodElementaryName &&
      caloriesValueFilled &&
      !errors?.caloriesValue &&
      !emptyCharacteristics &&
      !addCharacteristicValueErrors &&
      !defaultCharacteristicValueErrors &&
      !isAllCharacteristicsListsEmply
        ? true
        : false;

    return result;
  };

  useEffect(() => {
    const defaultCharacteristicsOnForm = [
      {
        characteristicInfo: {
          label: "Белки",
          value: PROTEIN_DEFAULT_ID,
        },
        characteristicValue: 0,
      },
      {
        characteristicInfo: {
          label: "Жиры",
          value: FAT_DEFAULT_ID,
        },
        characteristicValue: 0,
      },
      {
        characteristicInfo: {
          label: "Углеводы",
          value: CARBOHYDRATE_DEFAULT_ID,
        },
        characteristicValue: 0,
      },
    ];

    defaultCharacteristicsOnForm.forEach((defaultCharacteristic) => {
      defaultaracteristicsAppend(defaultCharacteristic);
    });
  }, []);

  // useEffect(() => {
  //   if (isSuccessGetAllFoodCharacteristicTypes) {
  //     const defaultCharacteristics: IFoodCharacteristicType[] =
  //       dataGetAllFoodCharacteristicTypes?.items.filter(
  //         (item: IFoodCharacteristicType) =>
  //           BASIC_CHARACTERISTICS_IDS_LIST.includes(item.id) &&
  //           item.id != CALORIES_DEFAULT_ID
  //       );

  //     const sortedDefaultCharacteristics: IFoodCharacteristicType[] =
  //       sortConsumedCharacteristics(defaultCharacteristics);

  //     const defaultCharacteristicsOnForm = sortedDefaultCharacteristics?.map(
  //       (characteristic: IFoodCharacteristicType) => {
  //         return {
  //           characteristicInfo: {
  //             label: characteristic.name,
  //             value: characteristic.id,
  //           },
  //           characteristicValue: 0,
  //         };
  //       }
  //     );

  //     defaultCharacteristicsOnForm?.forEach((defaultCharacteristic) => {
  //       defaultaracteristicsAppend(defaultCharacteristic);
  //     });
  //   }

  //   // const sortedDefaultCharacteristics: IFoodCharacteristicType[] =
  //   //   sortConsumedCharacteristics(defaultCharacteristics);
  // }, [dataGetAllFoodCharacteristicTypes]);

  useEffect(() => {
    if (Object.keys(dirtyFields).length && !Object.keys(touchedFields).length) {
      trigger();
    }
  }, [dirtyFields, touchedFields]);

  const handleAddNutrient = () => {
    newCharacteristicsForbiddenToAddIdsRef.current.push("");

    addCharacteristicListAppend({
      characteristicValue: 0,
    });
  };

  return (
    <section className="flex-grow-100 w-full flex flex-col flex-wrap justify-center items-center mb-3">
      <h2 className="mt-4 mb-3">Создать простое блюдо</h2>

      <div className="group relative w-full max-w-5xl">
        <div className="box_style"></div>
        <form
          className="box_content_transition flex flex-col flex-wrap justify-center w-full px-7 pt-5 pb-8"
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

          <div className="text-xl w-full flex-grow">
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
            <h3 className="text-xl my-3">Нутриенты:</h3>

            {defaultCharacteristicsFields.map((select, index) => {
              return (
                <div
                  key={`FoodElementaryCreateForm_div_defaultCharacteristicsFields_${select.id}_${index}`}
                  className="form-control flex flex-col"
                >
                  <div className="gap-x-3 flex mb-1">
                    <div className="flex flex-col justify-center gap-3 flex-grow mb-3">
                      <span className="flex gap-x-1">
                        <h3>Нутриент</h3>
                        <p className="text-red">*</p>
                      </span>
                      <Controller
                        key={`FoodElementaryCreateForm_controller_defaultCharacteristicsFields_${select.id}_${index}`}
                        name={
                          `defaultCharacteristicsList.${index}.characteristicInfo` as const
                        }
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            key={`FoodElementaryCreateForm_select_defaultCharacteristicsFields_${select.id}_${index}`}
                            className="relative text-sm rounded-xl  "
                            styles={SELECT_STYLES}
                            isDisabled={true}
                          />
                        )}
                      />
                    </div>

                    <div className="-mt-4 sm:max-w-[100px] max-w-[80px] flex-grow">
                      <InputIlluminated
                        id={`originalCharacteristicsList.${index}.characteristicValue`}
                        type="number"
                        placeholder="Вес (г)"
                        disableIllumination={true}
                        additionalStyles=" h-[67px] border-0 "
                        register={{
                          ...register(
                            `defaultCharacteristicsList.${index}.characteristicValue` as const
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
                        onClick={() => {}}
                        buttonPadding=" p-[14px] "
                        additionalStyles=" "
                        isDisabled={true}
                      />
                    </div>
                  </div>

                  {errors.defaultCharacteristicsList && (
                    <div
                      className={
                        Object.keys(errors).length > 0 &&
                        errors.defaultCharacteristicsList[index]
                          ? "flex flex-col mb-2 px-5 gap-y-2 justify-center"
                          : "hidden"
                      }
                    >
                      <p
                        className={
                          errors.defaultCharacteristicsList[index]
                            ?.characteristicInfo?.value
                            ? "text-pink-500 "
                            : " hidden "
                        }
                      >
                        {
                          errors.defaultCharacteristicsList[index]
                            ?.characteristicInfo?.value?.message
                        }
                      </p>
                      <p
                        className={
                          errors.defaultCharacteristicsList[index]
                            ?.characteristicValue
                            ? "text-pink-500 "
                            : " hidden "
                        }
                      >
                        {
                          errors.defaultCharacteristicsList[index]
                            ?.characteristicValue?.message
                        }
                      </p>
                    </div>
                  )}
                </div>
              );
            })}

            {addCharacteristicListFields.map((select, index) => {
              return (
                <div
                  key={`FoodElementaryCreateForm_Div_addCharacteristicsList_${select.id}_${index}`}
                  className="form-control flex flex-col"
                >
                  <div className="gap-x-3 flex mb-1">
                    <div className="flex flex-col justify-center gap-3 flex-grow mb-3">
                      <span className="flex gap-x-1">
                        <h3>Нутриент</h3>
                        <p className="text-red">*</p>
                      </span>
                      <Controller
                        key={`FoodElementaryCreateForm_Controller_addCharacteristicsList_${select.id}_${index}`}
                        name={
                          `addCharacteristicsList.${index}.characteristicInfo` as const
                        }
                        control={control}
                        render={({ field }) => (
                          <AsyncSelect
                            {...field}
                            key={`FoodElementaryCreateForm_AsyncSelect_addCharacteristicsList_${select.id}_${index}`}
                            className="relative text-sm rounded-xl  "
                            components={{ NoOptionsMessage }}
                            styles={SELECT_STYLES}
                            placeholder="Введите название нутриента"
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
                        id={`FoodElementaryCreateForm_addCharacteristicsList.${index}.characteristicValue`}
                        type="number"
                        placeholder="Вес (г)"
                        disableIllumination={true}
                        additionalStyles=" h-[67px] border-0 "
                        register={{
                          ...register(
                            `addCharacteristicsList.${index}.characteristicValue` as const
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
                          handleRemoveCharacteristicToAdd(index);
                        }}
                        buttonPadding=" p-[14px] "
                        additionalStyles=" "
                        // isDisabled={addFoodListFields.length > 1 ? false : true}
                      />
                    </div>
                  </div>

                  {errors.addCharacteristicsList && (
                    <div
                      className={
                        Object.keys(errors).length > 0 &&
                        errors.addCharacteristicsList[index]
                          ? "flex flex-col mb-2 px-5 gap-y-2 justify-center"
                          : "hidden"
                      }
                    >
                      <p
                        className={
                          errors.addCharacteristicsList[index]
                            ?.characteristicInfo?.value
                            ? "text-pink-500 "
                            : " hidden "
                        }
                      >
                        {
                          errors.addCharacteristicsList[index]
                            ?.characteristicInfo?.value?.message
                        }
                      </p>
                      <p
                        className={
                          errors.addCharacteristicsList[index]
                            ?.characteristicValue
                            ? "text-pink-500 "
                            : " hidden "
                        }
                      >
                        {
                          errors.addCharacteristicsList[index]
                            ?.characteristicValue?.message
                        }
                      </p>
                    </div>
                  )}
                </div>
              );
            })}

            <div className="w-full max-w-[280px]">
              <ButtonIlluminated
                label={"Добавить нутриент"}
                isDarkButton={true}
                isIlluminationFull={false}
                onClick={() => handleAddNutrient()}
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

export default FoodElementaryCreateForm;
