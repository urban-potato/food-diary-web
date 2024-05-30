import { FC, useEffect, useRef } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { IFoodCharacteristicType } from "../../../global/types/entities-types";
import {
  useChangeFoodCharacteristicTypeNameMutation,
  useCreateFoodCharacteristicTypeMutation,
  useDeleteFoodCharacteristicTypeMutation,
} from "../api/food-characteristic-type.api";
import ButtonIlluminated from "../../../ui/ButtonIlluminated/ButtonIlluminated";
import { BASIC_CHARACTERISTICS_IDS_LIST } from "../../../global/constants/constants";
import InputFieldRowWithDeleteButton from "../../../components/InputFieldRowWithDeleteButton/InputFieldRowWithDeleteButton";
import { editFoodCharacteristicTypesValidationSchema } from "../constants/FoodCharacteristicTypesInfoTile.constants";

type TProps = {
  originalFoodCharacteristicTypes: IFoodCharacteristicType[];
  isEditMode: boolean;
  setIsEditMode: Function;
};

type TFoodCharacteristicTypeInfoEditFormData = {
  addFoodCharacteristicTypesList: {
    foodCharacteristicTypeName: string;
  }[];
  originalFoodCharacteristicTypesList: {
    foodCharacteristicType: {
      id: string;
      name: string;
    };
  }[];
};

const FoodCharacteristicTypesInfoEditForm: FC<TProps> = ({
  originalFoodCharacteristicTypes,
  isEditMode,
  setIsEditMode,
}) => {
  // Food Characteristic Types to delete
  const originalIdsToRemoveRef = useRef<Array<String>>(new Array());

  // Edit Food Characteristic Types
  const [doCreateFoodCharacteristicType] =
    useCreateFoodCharacteristicTypeMutation();
  const [doChangeFoodCharacteristicTypeName] =
    useChangeFoodCharacteristicTypeNameMutation();
  const [doDeleteFoodCharacteristicType] =
    useDeleteFoodCharacteristicTypeMutation();

  // useForm
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
    getValues,
    control,
    trigger,
  } = useForm<TFoodCharacteristicTypeInfoEditFormData>({
    resolver: yupResolver(editFoodCharacteristicTypesValidationSchema),
    mode: "onChange",
  });

  // For Generating Original Food Characteristic Types Fields
  const {
    fields: originalFields,
    append: originalAppend,
    remove: originalRemove,
  } = useFieldArray({
    name: "originalFoodCharacteristicTypesList",
    control,
  });

  // For Generating Add Food Characteristic Types Fields
  const {
    fields: toAddFields,
    append: toAddAppend,
    remove: toAddRemove,
  } = useFieldArray({
    name: "addFoodCharacteristicTypesList",
    control,
  });

  const handleRemoveOriginalItem = (itemIndex: number) => {
    const itemId = getValues(
      `originalFoodCharacteristicTypesList.${itemIndex}.foodCharacteristicType.id`
    );

    originalIdsToRemoveRef.current.push(itemId);

    originalRemove(itemIndex);
  };

  const handleRemoveItemToAdd = (itemIndex: number) => {
    toAddRemove(itemIndex);
  };

  let checkIfFilledRight = () => {
    let emptyNewItems = getValues("addFoodCharacteristicTypesList")?.find(
      (item) => item.foodCharacteristicTypeName === undefined
    );

    const isAllListsEmply =
      !getValues("addFoodCharacteristicTypesList")?.length &&
      !getValues("originalFoodCharacteristicTypesList")?.length;

    let newItemsErrors = errors?.addFoodCharacteristicTypesList;
    let originalItemsErrors = errors?.originalFoodCharacteristicTypesList;

    let result =
      !emptyNewItems &&
      !newItemsErrors &&
      !originalItemsErrors &&
      !isAllListsEmply
        ? true
        : false;

    return result;
  };

  useEffect(() => {
    const originalItems = originalFoodCharacteristicTypes.map(
      (item: IFoodCharacteristicType) => {
        return {
          foodCharacteristicType: {
            id: item.id,
            name: item.name,
          },
        };
      }
    );

    originalItems.forEach((originalItem) => {
      originalAppend(originalItem);
    });
  }, []);

  const onSubmit: SubmitHandler<
    TFoodCharacteristicTypeInfoEditFormData
  > = async (data) => {
    console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++");
    console.log("data", data);

    // Delete Nutrients List
    const deleteNutrientsList = originalIdsToRemoveRef.current;

    // Change Nutrients List
    let changeNutrientsList = [];

    const originalItemsFromFormList =
      data?.originalFoodCharacteristicTypesList?.map((item) => {
        return {
          id: item?.foodCharacteristicType.id,
          name: item?.foodCharacteristicType.name,
        };
      });

    const itemsWithoutDeleted = originalFoodCharacteristicTypes.filter(
      (item) => !deleteNutrientsList.includes(item.id)
    );

    for (const originalItem of originalItemsFromFormList) {
      const itemToChange = itemsWithoutDeleted.find(
        (item) => item.id == originalItem.id
      );

      if (itemToChange != undefined && itemToChange.name != originalItem.name) {
        changeNutrientsList.push(originalItem);

        console.log("Push in Change Nutrients List");
      }
    }

    // Add Nutrients List
    const addNutrientsList = data?.addFoodCharacteristicTypesList?.map(
      (item) => {
        return {
          name: item?.foodCharacteristicTypeName,
        };
      }
    );

    // Delete Food Characteristic Types
    for (const [index, itemToDeleteId] of deleteNutrientsList.entries()) {
      const deteleItemData = {
        foodCharacteristicTypeId: itemToDeleteId,
        isInvalidationNeeded:
          index == deleteNutrientsList.length - 1 &&
          changeNutrientsList.length + addNutrientsList.length == 0
            ? true
            : false,
      };
      await doDeleteFoodCharacteristicType(deteleItemData).catch((e) =>
        console.log(e)
      );

      console.log("Delete Food Characteristic Types");
    }

    // Change Food Characteristic Types Name
    for (const [index, originalItem] of changeNutrientsList.entries()) {
      const changeItemNameData = {
        foodCharacteristicTypeId: originalItem.id,
        data: {
          name: originalItem.name,
        },
        isInvalidationNeeded:
          index == changeNutrientsList.length - 1 &&
          addNutrientsList.length == 0
            ? true
            : false,
      };

      await doChangeFoodCharacteristicTypeName(changeItemNameData).catch((e) =>
        console.log(e)
      );

      console.log("Change Food Characteristic Types Name");
    }

    // Add New Food Characteristic Types
    for (const [index, itemToAdd] of addNutrientsList.entries()) {
      const addItemData = {
        data: {
          name: itemToAdd.name,
        },
        isInvalidationNeeded:
          index == addNutrientsList.length - 1 ? true : false,
      };

      await doCreateFoodCharacteristicType(addItemData).catch((e) =>
        console.log(e)
      );

      console.log("Add New Food Characteristic Types");
    }

    reset();
    setIsEditMode(!isEditMode);
  };

  return (
    <div className="w-full max-w-5xl flex flex-col justify-center items-start -mt-5">
      <form
        className="flex flex-col flex-wrap justify-center w-full"
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
      >
        <div className="flex flex-col">
          {originalFields.map((item, index) => {
            const isDisabled = BASIC_CHARACTERISTICS_IDS_LIST.includes(
              originalFields[index].foodCharacteristicType.id
            )
              ? true
              : false;

            return (
              <InputFieldRowWithDeleteButton
                key={`FoodCharacteristicTypeInfoEditForm_div_originalFoodCharacteristicTypesList_${item.id}_${index}`}
                itemId={item.id}
                itemIndex={index}
                label={"Нутриент"}
                handleRemoveItem={handleRemoveOriginalItem}
                controllerName={
                  `originalFoodCharacteristicTypesList.${index}.foodCharacteristicType.name` as const
                }
                control={control}
                register={{
                  ...register(
                    `originalFoodCharacteristicTypesList.${index}.foodCharacteristicType.name`
                  ),
                }}
                errors={errors}
                errorsGroup={errors.originalFoodCharacteristicTypesList}
                errorFeild={
                  errors.originalFoodCharacteristicTypesList?.[index]
                    ?.foodCharacteristicType?.name
                }
                isInputFieldDisabled={isDisabled}
                isDeleteButtonDisabled={isDisabled}
              />
            );
          })}

          {toAddFields.map((item, index) => {
            return (
              <InputFieldRowWithDeleteButton
                key={`FoodCharacteristicTypeInfoEditForm_Div_addFoodCharacteristicTypesList_${item.id}_${index}`}
                itemId={item.id}
                itemIndex={index}
                label={"Нутриент"}
                handleRemoveItem={handleRemoveItemToAdd}
                controllerName={
                  `addFoodCharacteristicTypesList.${index}.foodCharacteristicTypeName` as const
                }
                control={control}
                register={{
                  ...register(
                    `addFoodCharacteristicTypesList.${index}.foodCharacteristicTypeName`
                  ),
                }}
                errors={errors}
                errorsGroup={errors.addFoodCharacteristicTypesList}
                errorFeild={
                  errors.addFoodCharacteristicTypesList?.[index]
                    ?.foodCharacteristicTypeName
                }
              />
            );
          })}

          <div className="w-full max-w-[280px] mt-3">
            <ButtonIlluminated
              label={"Еще один ингредиент"}
              isDarkButton={true}
              isIlluminationFull={false}
              onClick={() => {
                toAddAppend({
                  foodCharacteristicTypeName: "",
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

export default FoodCharacteristicTypesInfoEditForm;
