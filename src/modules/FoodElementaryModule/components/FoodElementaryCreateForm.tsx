import { ChangeEvent, FC, useEffect, useRef } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { useCreateFoodElementaryMutation } from "../api/food-elementary.api.ts";
import InputIlluminated from "../../../ui/InputIlluminated/InputIlluminated.tsx";
import ButtonIlluminated from "../../../ui/ButtonIlluminated/ButtonIlluminated.tsx";
import { createFoodElementaryValidationSchema } from "../constants/FoodElementaryModule.constants.ts";
import { useAddFoodCharacteristicMutation } from "../api/food-characteristic.api.ts";
import { useGetAllFoodCharacteristicTypesQuery } from "../../FoodCharacteristicTypesInfoTile/api/food-characteristic-type.api.ts";
import { IFoodCharacteristicType } from "../../../global/types/entities-types.ts";
import {
  BASIC_CHARACTERISTICS_IDS_LIST,
  CALORIES_DEFAULT_ID,
  CARBOHYDRATE_DEFAULT_ID,
  DECIMAL_REGEX,
  FAT_DEFAULT_ID,
  PROTEIN_DEFAULT_ID,
  ROUTES_LIST,
} from "../../../global/constants/constants.ts";
import { sortCharacteristics } from "../../../global/helpers/sort-characteristics.helper.ts";
import DisabledSelectRowWithWeightField from "../../../components/DisabledSelectRowWithWeightField/DisabledSelectRowWithWeightField.tsx";
import AsyncSelectRowWithWeightField from "../../../components/AsyncSelectRowWithWeightField/AsyncSelectRowWithWeightField.tsx";
import { replaceIncorrectDecimal } from "../../../global/helpers/replace-incorrect-decimal.helper.ts";
import { useAppDispatch } from "../../../global/store/store-hooks.ts";
import { useNavigate } from "react-router-dom";
import { handleApiCallError } from "../../../global/helpers/handle-api-call-error.helper.ts";
import Preloader from "../../../components/Preloader/Preloader.tsx";
import { compareLabels } from "../../../global/helpers/compare-labels.helper.ts";

type TProps = {
  setShowCreateForm: Function;
  showCreateForm: boolean;
};

type TFoodElementaryCreateFormData = {
  foodElementaryName: string;
  caloriesValue: string;
  addCharacteristicsList: {
    characteristicInfo?: {
      label?: string | undefined;
      value: string;
    };
    characteristicValue: string;
  }[];
  defaultCharacteristicsList: {
    characteristicInfo: {
      label: string;
      value: string;
    };
    characteristicValue: string;
  }[];
};

type TSelectElement = {
  label: string;
  value: string;
};

const FoodElementaryCreateForm: FC<TProps> = ({
  setShowCreateForm,
  showCreateForm,
}) => {
  const newCharacteristicsForbiddenToAddIdsRef = useRef<Array<String>>(
    new Array()
  );

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [doCreateFoodElementary] = useCreateFoodElementaryMutation();
  const [doAddFoodCharacteristic] = useAddFoodCharacteristicMutation();

  // Food Characteristics Types for Async Select
  const {
    isLoading: isLoadingGetAllFoodCharacteristicTypes,
    data: dataGetAllFoodCharacteristicTypes,
    isError: isErrorGetAllFoodCharacteristicTypes,
    error: errorGetAllFoodCharacteristicTypes,
    isSuccess: isSuccessGetAllFoodCharacteristicTypes,
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

    filteredOptions.sort(compareLabels);

    callback(filteredOptions);
  };

  // defaultValues
  let defaultValues = {
    caloriesValue: "0",
  };

  // useForm
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isValid },
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
    const defaultCharacteristics = data.defaultCharacteristicsList;
    const additionalCharacteristics = data.addCharacteristicsList;

    // Create Food Elementary
    const createFoodElementaryData = {
      data: {
        name: data.foodElementaryName,
        proteinValue: "0",
        fatValue: "0",
        carbohydrateValue: "0",
        caloriesValue: data.caloriesValue,
      },
      isInvalidationNeeded: additionalCharacteristics.length > 0 ? false : true,
    };

    for (const defaultCharacteristic of defaultCharacteristics) {
      switch (defaultCharacteristic.characteristicInfo?.value) {
        case PROTEIN_DEFAULT_ID:
          createFoodElementaryData.data.proteinValue =
            defaultCharacteristic.characteristicValue;
          break;
        case FAT_DEFAULT_ID:
          createFoodElementaryData.data.fatValue =
            defaultCharacteristic.characteristicValue;
          break;
        case CARBOHYDRATE_DEFAULT_ID:
          createFoodElementaryData.data.carbohydrateValue =
            defaultCharacteristic.characteristicValue;
          break;
        default:
          break;
      }
    }

    await doCreateFoodElementary(createFoodElementaryData)
      .unwrap()
      .then(async (responseFoodElementaryId) => {
        for (const [
          index,
          characteristic,
        ] of additionalCharacteristics.entries()) {
          const addCharacteristicData = {
            data: {
              foodElementaryId: responseFoodElementaryId,
              characteristicTypeId: characteristic.characteristicInfo?.value,
              value: characteristic.characteristicValue,
            },
            isInvalidationNeeded:
              index == additionalCharacteristics.length - 1 ? true : false,
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
    if (addCharacteristicListFields.length === 1) {
      addCharacteristicListRemove(0);
      addCharacteristicListAppend({
        characteristicValue: "0",
      });
    }

    setShowCreateForm(!showCreateForm);
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
        sortCharacteristics(defaultCharacteristics);

      const defaultCharacteristicsOnForm = sortedDefaultCharacteristics?.map(
        (characteristic: IFoodCharacteristicType) => {
          return {
            characteristicInfo: {
              label: characteristic.name,
              value: characteristic.id,
            },
            characteristicValue: "0",
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
      characteristicValue: "0",
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
                  id={"FoodElementaryCreateForm_foodElementaryName"}
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
                  id={"FoodElementaryCreateForm_caloriesValue"}
                  type="text"
                  inputLabel="Калорийность на 100г (ккал.)"
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

              <div className="flex flex-col  mt-5">
                {defaultCharacteristicsFields.map((item, index) => {
                  return (
                    <DisabledSelectRowWithWeightField
                      key={`FoodElementaryCreateForm_div_defaultCharacteristicsFields_${item.id}_${index}`}
                      itemId={item.id}
                      itemIndex={index}
                      label={"Нутриент"}
                      selectPlaceholder={"Название..."}
                      handleRemoveItem={() => {}}
                      controllerName={
                        `defaultCharacteristicsList.${index}.characteristicInfo` as const
                      }
                      control={control}
                      register={{
                        ...register(
                          `defaultCharacteristicsList.${index}.characteristicValue` as const
                        ),
                      }}
                      isDeleteButtonDisabled={true}
                      hasErrors={!!errors?.defaultCharacteristicsList}
                      errorMessagesList={
                        [
                          errors?.defaultCharacteristicsList?.[index]
                            ?.characteristicInfo?.value?.message,
                          errors?.defaultCharacteristicsList?.[index]
                            ?.characteristicValue?.message,
                        ].filter((item) => !!item) as string[]
                      }
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
                    onClick={() => handleAddNutrient()}
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

export default FoodElementaryCreateForm;
