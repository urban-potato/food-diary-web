import * as yup from "yup";
import {
  useChangeFoodCharacteristicValueMutation,
  useChangeFoodElementaryNameMutation,
  useDeleteFoodElementaryMutation,
} from "../api/foodElementary.api";
import { validValues } from "../constants/constants";
import {
  FoodElementaryData,
  FoodElementaryPieceEditProps,
  IFoodCharacteristic,
} from "../types/types";
import { useForm, useFormState } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FC, useEffect, useRef } from "react";
import ButtonIlluminated from "../../../ui/ButtonIlluminated/ButtonIlluminated.tsx";
import InputIlluminated from "../../../ui/InputIlluminated/InputIlluminated.tsx";
import { Player } from "@lordicon/react";

import EDIT_ICON from "../../../global/assets/system-regular-63-settings-cog.json";
import DELETE_ICON from "../../../global/assets/system-regular-39-trash.json";

const FoodElementaryPieceEdit: FC<FoodElementaryPieceEditProps> = ({
  id,
  name,
  characteristics,
  setIsEditMode,
}) => {
  const [doDeleteFood, doDeleteFoodResult] = useDeleteFoodElementaryMutation();

  let deleteFood = () => {
    doDeleteFood(id);
  };

  let validationSchemaObject: any = {
    name: yup
      .string()
      .min(
        validValues.name.min.value,
        validValues.name.min.message(validValues.name.min.value)
      )
      .max(
        validValues.name.max.value,
        validValues.name.max.message(validValues.name.min.value)
      )
      .required(validValues.requiredErrorMessage),
  };

  characteristics.forEach((item: IFoodCharacteristic) => {
    validationSchemaObject[`${item.foodCharacteristicId}`] = yup
      .number()
      .typeError(validValues.numberTypeErrorMessage)
      // .matches(
      //   /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      //   `• ${item.characteristicName}: ${validValues.foodCharacteristic.error}`
      // )
      .transform((cv) => (isNaN(cv) ? undefined : cv))
      .min(
        validValues.foodCharacteristic.min.value,
        validValues.foodCharacteristic.min.message(
          validValues.foodCharacteristic.min.value
        )
      )
      // .positive()
      .integer();
  });

  const validationSchema = yup.object().shape(validationSchemaObject);

  // console.log("validationSchema");
  // console.log(validationSchema);

  let defaultValues: any = {
    name: name,
  };

  characteristics.forEach((item: IFoodCharacteristic) => {
    defaultValues[`${item.foodCharacteristicId}`] = item.value;
  });

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
    getValues,
    control,
    trigger,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
    defaultValues: defaultValues,
  });

  const { dirtyFields, touchedFields } = useFormState({ control });

  const [doChangeFoodElementaryName, doChangeFoodElementaryNameResult] =
    useChangeFoodElementaryNameMutation();

  const [
    doChangeFoodCharacteristicValue,
    doChangeFoodCharacteristicValueResult,
  ] = useChangeFoodCharacteristicValueMutation();

  const editFoodCharacteristicsInputs = characteristics.map(
    (c: IFoodCharacteristic) => {
      return (
        <div className="flex-grow-100 ">
          <InputIlluminated
            key={`${id}_${c.foodCharacteristicId}`}
            id={c.foodCharacteristicId}
            type="number"
            placeholder={c.characteristicName}
            register={{ ...register(`${c.foodCharacteristicId}`) }}
            // errorMessage={errors[`${c.foodCharacteristicId}`]?.message}
            isError={errors[`${c.foodCharacteristicId}`] ? true : false}
          />
        </div>
      );
    }
  );

  const onSubmit = async (data: FoodElementaryData) => {
    console.log("data");
    console.log(data);

    let submitFoodNameData = {
      name: data.name,
    };
    let foodCharacteristicsToChange: any = {};

    const dataKeys = Object.keys(data);

    dataKeys.forEach((key) => {
      if (key !== "name") {
        foodCharacteristicsToChange[`${key}`] =
          data[`${key}` as keyof FoodElementaryData];
      }
    });

    const foodCharacteristicsToChangeKeys = Object.keys(
      foodCharacteristicsToChange
    );

    try {
      const resultChangeFoodName = doChangeFoodElementaryName({
        id: id,
        data: submitFoodNameData,
      });

      foodCharacteristicsToChangeKeys.forEach((key) => {
        const resultChangeFoodCharacteristicValue =
          doChangeFoodCharacteristicValue({
            id: key,
            data: {
              value: foodCharacteristicsToChange[`${key}`],
            },
          });
      });

      reset();
      setIsEditMode(false);
    } catch (error: any) {
      console.log("error");
      console.log(error);
      alert(error?.data?.title);
    }
  };

  const editIconPlayerRef = useRef<Player>(null);
  const deleteIconPlayerRef = useRef<Player>(null);
  const ICON_SIZE = 28;

  const editFoodCharacteristicsErrors = characteristics.map(
    (c: IFoodCharacteristic) => {
      return (
        <p
          key={`error_${id}_${c.foodCharacteristicId}`}
          className={
            errors[`${c.foodCharacteristicId}`] ? "text-pink-500 " : " hidden "
          }
        >
          • {c.characteristicName}:{" "}
          {`${errors[`${c.foodCharacteristicId}`]?.message}`}
        </p>
      );
    }
  );

  let isCharacteristicsFilledWrong = characteristics.some(
    (c: IFoodCharacteristic) => {
      return (
        Object.keys(errors).length &&
        Object.keys(errors).includes(c.foodCharacteristicId)
      );
    }
  );

  let isFilledRight =
    getValues("name") && !errors?.name && !isCharacteristicsFilledWrong
      ? true
      : false;

  useEffect(() => {
    if (Object.keys(dirtyFields).length && !Object.keys(touchedFields).length) {
      trigger();
    }
  }, [dirtyFields, touchedFields]);

  return (
    <div
      className="flex flex-col  w-full pb-3
    "
    >
      <form
        className="   flex flex-col flex-wrap justify-center "
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="text-xl -mt-6">
          <InputIlluminated
            id="name"
            type="text"
            placeholder="Название блюда"
            register={{ ...register("name") }}
            isError={errors.name ? true : false}
            isRequired={true}
          />
        </div>

        <div className="mt-4 flex flex-col">
          <div className=" font-semibold mb-1 text-[17px]">
            Нутриенты на 100гр:
          </div>

          <div
            className=" w-full 
          flex flex-wrap 
          gap-x-4 

          justify-stretch items-stretch"
          >
            {editFoodCharacteristicsInputs}
          </div>
        </div>

        <div
          className={
            Object.keys(errors).length > 0
              ? "  flex flex-col mt-5 px-5 gap-y-2 justify-center "
              : " hidden "
          }
        >
          <p className={errors.name ? "text-pink-500 " : " hidden "}>
            {`${errors.name?.message}`}
          </p>

          {editFoodCharacteristicsErrors}
        </div>

        <div
          className=" mt-6 
        flex flex-wrap w-full 
        gap-x-4 gap-y-3
        justify-stretch items-center"
        >
          <span className=" flex-grow">
            <ButtonIlluminated
              label="Сохранить"
              isDarkButton={true}
              isIlluminationFull={false}
              isButton={true}
              type="submit"
              buttonPadding=" p-4 "
              isDisabled={isFilledRight ? false : true}
            />
          </span>
          <span className=" flex-grow">
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

      <div className="order-[-1] -mt-2 ml-auto gap-x-2 flex justify-center items-start ">
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

        <span role="button" onClick={() => deleteFood()}>
          <span
            onMouseEnter={() =>
              deleteIconPlayerRef.current?.playFromBeginning()
            }
          >
            <Player
              ref={deleteIconPlayerRef}
              icon={DELETE_ICON}
              size={ICON_SIZE}
              colorize="#0d0b26"
            />
          </span>
        </span>
      </div>
    </div>
  );
};

export default FoodElementaryPieceEdit;
