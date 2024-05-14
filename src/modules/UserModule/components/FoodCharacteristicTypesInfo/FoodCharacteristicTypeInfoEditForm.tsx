import { FC, useEffect, useRef } from "react";
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { IFoodCharacteristicType } from "../../../../global/types/types";
import { Player } from "@lordicon/react";
import EDIT_ICON from "../../../../global/assets/system-regular-63-settings-cog.json";
import DELETE_ICON from "../../../../global/assets/system-regular-39-trash.json";
import {
  useChangeFoodCharacteristicTypeNameMutation,
  useCreateFoodCharacteristicTypeMutation,
  useDeleteFoodCharacteristicTypeMutation,
} from "../../api/foodCharacteristicType.api";
import { editFoodCharacteristicTypesValidationSchema } from "../../constants/constants";
import InputIlluminated from "../../../../ui/InputIlluminated/InputIlluminated";
import ButtonIlluminated from "../../../../ui/ButtonIlluminated/ButtonIlluminated";

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

const FoodCharacteristicTypeInfoEditForm: FC<TProps> = ({
  originalFoodCharacteristicTypes,
  isEditMode,
  setIsEditMode,
}) => {
  // Food Characteristic Types to delete
  const originalIdsToRemoveRef = useRef<Array<String>>(new Array());

  const editIconPlayerRef = useRef<Player>(null);
  const deleteIconPlayerRef = useRef<Player>(null);
  const ICON_SIZE = 28;

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

    // console.log("\n-----------------------");
    // console.log("emptyNewItems", emptyNewItems);
    // console.log("isAllListsEmply", isAllListsEmply);
    // console.log("newItemsErrors", newItemsErrors);
    // console.log("originalItemsErrors", originalItemsErrors);
    // console.log("-----------------------\n");

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

    // Delete Food Characteristic Types
    const itemsToDelete = originalIdsToRemoveRef.current;

    for (const itemToDeleteId of itemsToDelete) {
      await doDeleteFoodCharacteristicType(itemToDeleteId).catch((e) =>
        console.log(e)
      );

      console.log("Delete Food Characteristic Types");
    }

    // Change Food Characteristic Types Name
    const originalItemsFromFormList =
      data?.originalFoodCharacteristicTypesList?.map((item) => {
        return {
          id: item?.foodCharacteristicType.id,
          name: item?.foodCharacteristicType.name,
        };
      });

    const itemsWithoutDeleted = originalFoodCharacteristicTypes.filter(
      (item) => !itemsToDelete.includes(item.id)
    );

    for (const originalItem of originalItemsFromFormList) {
      const itemToChange = itemsWithoutDeleted.find(
        (item) => item.id == originalItem.id
      );

      if (itemToChange != undefined && itemToChange.name != originalItem.name) {
        const changeItemNameData = {
          foodCharacteristicTypeId: originalItem.id,
          data: {
            name: originalItem.name,
          },
        };

        await doChangeFoodCharacteristicTypeName(changeItemNameData).catch(
          (e) => console.log(e)
        );

        console.log("Change Food Characteristic Types Name");
      }
    }

    // Add New Food Characteristic Types
    const addItemsList = data?.addFoodCharacteristicTypesList?.map((item) => {
      return {
        name: item?.foodCharacteristicTypeName,
      };
    });

    for (const itemToAdd of addItemsList) {
      const addItemData = {
        name: itemToAdd.name,
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
    <div className="w-full max-w-5xl flex flex-col justify-center items-start">
      <form
        className="flex flex-col flex-wrap justify-center w-full -mt-11"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col">
          <h3 className="text-xl my-3">Нутриенты:</h3>

          {originalFields.map((item, index) => {
            return (
              <div
                key={`FoodCharacteristicTypeInfoEditForm_div_originalFoodCharacteristicTypesList_${item.id}_${index}`}
                className="form-control flex flex-col"
              >
                <div className="gap-x-3 flex ">
                  <div className="flex flex-col justify-center gap-3 flex-grow -mt-4">
                    <Controller
                      key={`FoodCharacteristicTypeInfoEditForm_controller_originalFoodCharacteristicTypesList_${item.id}_${index}`}
                      name={
                        `originalFoodCharacteristicTypesList.${index}.foodCharacteristicType.name` as const
                      }
                      control={control}
                      render={({ field }) => (
                        <InputIlluminated
                          {...field}
                          key={`FoodCharacteristicTypeInfoEditForm_select_originalFoodCharacteristicTypesList_${item.id}_${index}`}
                          ref={null}
                          id={`originalFoodCharacteristicTypesList.${index}.foodCharacteristicType.name`}
                          type="text"
                          placeholder="Название нутриента"
                          disableIllumination={true}
                          additionalStyles=" h-[67px] border-0 "
                          register={{
                            ...register(
                              `originalFoodCharacteristicTypesList.${index}.foodCharacteristicType.name`
                            ),
                          }}
                          isRequired={true}
                          isDisabled={index < 3 ? true : false}
                        />
                      )}
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
                        handleRemoveOriginalItem(index);
                      }}
                      buttonPadding=" p-[14px] "
                      additionalStyles=" "
                      isDisabled={index < 3 ? true : false}
                    />
                  </div>
                </div>

                {errors.originalFoodCharacteristicTypesList && (
                  <div
                    className={
                      Object.keys(errors).length > 0 &&
                      errors.originalFoodCharacteristicTypesList[index]
                        ? "flex flex-col mb-2 px-5 gap-y-2 justify-center"
                        : "hidden"
                    }
                  >
                    <p
                      className={
                        errors.originalFoodCharacteristicTypesList[index]
                          ?.foodCharacteristicType?.name
                          ? "text-pink-500 "
                          : " hidden "
                      }
                    >
                      {
                        errors.originalFoodCharacteristicTypesList[index]
                          ?.foodCharacteristicType?.name?.message
                      }
                    </p>
                  </div>
                )}
              </div>
            );
          })}

          {toAddFields.map((item, index) => {
            return (
              <div
                key={`FoodCharacteristicTypeInfoEditForm_Div_addFoodCharacteristicTypesList_${item.id}_${index}`}
                className="form-control flex flex-col"
              >
                <div className="gap-x-3 flex mb-1">
                  <div className="flex flex-col justify-center gap-3 flex-grow -mt-4">
                    <Controller
                      key={`FoodCharacteristicTypeInfoEditForm_Controller_addFoodCharacteristicTypesList_${item.id}_${index}`}
                      name={
                        `addFoodCharacteristicTypesList.${index}.foodCharacteristicTypeName` as const
                      }
                      control={control}
                      render={({ field }) => (
                        <InputIlluminated
                          {...field}
                          key={`FoodCharacteristicTypeInfoEditForm_select_addFoodCharacteristicTypesList_${item.id}_${index}`}
                          ref={null}
                          id={`addFoodCharacteristicTypesList.${index}.foodCharacteristicTypeName`}
                          type="text"
                          placeholder="Название нутриента"
                          disableIllumination={true}
                          additionalStyles=" h-[67px] border-0 "
                          register={{
                            ...register(
                              `addFoodCharacteristicTypesList.${index}.foodCharacteristicTypeName`
                            ),
                          }}
                          isRequired={true}
                        />
                      )}
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
                        handleRemoveItemToAdd(index);
                      }}
                      buttonPadding=" p-[14px] "
                      additionalStyles=" "
                    />
                  </div>
                </div>

                {errors.addFoodCharacteristicTypesList && (
                  <div
                    className={
                      Object.keys(errors).length > 0 &&
                      errors.addFoodCharacteristicTypesList[index]
                        ? "flex flex-col mb-2 px-5 gap-y-2 justify-center"
                        : "hidden"
                    }
                  >
                    <p
                      className={
                        errors.addFoodCharacteristicTypesList[index]
                          ?.foodCharacteristicTypeName
                          ? "text-pink-500 "
                          : " hidden "
                      }
                    >
                      {
                        errors.addFoodCharacteristicTypesList[index]
                          ?.foodCharacteristicTypeName?.message
                      }
                    </p>
                  </div>
                )}
              </div>
            );
          })}

          <div className="w-full max-w-[280px] mt-2">
            <ButtonIlluminated
              label={"Добавить нутриент"}
              isDarkButton={true}
              isIlluminationFull={false}
              onClick={() => {
                toAddAppend({
                  foodCharacteristicTypeName: "",
                });
              }}
              buttonPadding=" p-[14px] "
              additionalStyles=""
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap w-full gap-x-4 gap-y-3 justify-stretch items-center">
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

      <div className="order-[-1] ml-auto gap-x-2 flex justify-center items-start">
        <span role="button" onClick={() => setIsEditMode(false)}>
          <span
            onMouseEnter={() => editIconPlayerRef.current?.playFromBeginning()}
          >
            <Player
              ref={editIconPlayerRef}
              icon={EDIT_ICON}
              size={ICON_SIZE}
              colorize="#0d0b26"
            />
          </span>
        </span>
      </div>
    </div>
  );
};

export default FoodCharacteristicTypeInfoEditForm;
