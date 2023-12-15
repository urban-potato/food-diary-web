import * as yup from "yup";
import {
  useChangeFoodCharacteristicValueMutation,
  useChangeFoodElementaryNameMutation,
  useDeleteFoodElementaryMutation,
} from "../api/foodElementary.api";
import { validValues } from "../constants/constants";
import { FoodElementaryPieceEditProps } from "../types/types";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from "../../../ui/input";

import { Player } from "@lordicon/react";
import EDIT_ICON from "../../../global/assets/system-regular-63-settings-cog.json";
import DELETE_ICON from "../../../global/assets/system-regular-39-trash.json";
import { useRef } from "react";
import IlluminatedButton from "../../../components/Buttons/IlluminatedButton";

const FoodElementaryPieceEdit = ({
  id,
  name,
  characteristics,
  setIsEditMode,
}: FoodElementaryPieceEditProps) => {
  const [doDeleteFood, doDeleteFoodResult] = useDeleteFoodElementaryMutation();

  let deleteFood = () => {
    doDeleteFood(id);
  };

  let validationSchemaObject = {
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

  characteristics.forEach((item) => {
    validationSchemaObject[`${item.foodCharacteristicId}`] = yup
      .number()
      .typeError(validValues.numberTypeErrorMessage)
      .transform((cv) => (isNaN(cv) ? undefined : cv))
      .min(
        validValues.foodCharacteristic.min.value,
        validValues.foodCharacteristic.min.message(
          validValues.foodCharacteristic.min.value
        )
      )
      .integer();
  });

  const validationSchema = yup.object().shape(validationSchemaObject);

  console.log("validationSchema");
  console.log(validationSchema);

  let defaultValues = {
    name: name,
  };

  characteristics.forEach((item) => {
    defaultValues[`${item.foodCharacteristicId}`] = item.value;
  });

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
    defaultValues: defaultValues,
  });

  const [doChangeFoodElementaryName, doChangeFoodElementaryNameResult] =
    useChangeFoodElementaryNameMutation();

  const [
    doChangeFoodCharacteristicValue,
    doChangeFoodCharacteristicValueResult,
  ] = useChangeFoodCharacteristicValueMutation();

  const editFoodCharacteristicsInputs = characteristics.map((c) => {
    return (
      <div className="flex-grow-100 ">
        <Input
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
  });

  const onSubmit = async (data) => {
    console.log("data");
    console.log(data);

    let submitFoodNameData = {
      name: data.name,
    };
    let foodCharacteristicsToChange = {};

    const dataKeys = Object.keys(data);

    dataKeys.forEach((key) => {
      if (key !== "name") {
        foodCharacteristicsToChange[`${key}`] = data[`${key}`];
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

      console.log("foodCharacteristicsToChange");
      console.log(foodCharacteristicsToChange);

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
    } catch (error) {
      console.log("error");
      console.log(error);
      alert(error?.data?.title);
    }
  };

  const editIconPlayerRef = useRef<Player>(null);
  const deleteIconPlayerRef = useRef<Player>(null);
  const ICON_SIZE = 28;

  const editFoodCharacteristicsErrors = characteristics.map((c) => {
    return (
      <p
        key={`error_${id}_${c.foodCharacteristicId}`}
        className={
          errors[`${c.foodCharacteristicId}`] ? "text-pink-500 " : " hidden "
        }
      >
        • {c.characteristicName}: {errors[`${c.foodCharacteristicId}`]?.message}
      </p>
    );
  });

  return (
    <div
      className="flex flex-col  w-full pb-3
    "
    >
      <form
        className="   flex flex-col flex-wrap justify-center "
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="text-xl -mt-8">
          <Input
            id="name"
            type="text"
            placeholder="Название блюда"
            register={{ ...register("name") }}
            // errorMessage={errors.name?.message}
            isError={errors.name ? true : false}
            // inset=" inset-0 "
            // bgError = "#F8E4EB"
            isRequired={true}
          />
        </div>

        <div className="mt-4 flex flex-col">
          <div className=" font-semibold mb-1 text-[17px]">
            Нутриенты на 100гр:
          </div>
          {/* <div className="flex flex-wrap gap-x-4 ">{foodCharacteristics}</div> */}
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
            {errors.name?.message}
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
            <IlluminatedButton
              label="Сохранить"
              isDarkButton={true}
              isIlluminationFull={false}
              // additionalStyles=" w-[280px] "
              isButton={true}
              type="submit"
              buttonPadding=" p-4 "
            />
          </span>
          <span className=" flex-grow">
            <IlluminatedButton
              label="Отменить"
              isDarkButton={false}
              isIlluminationFull={false}
              onClick={() => {
                setIsEditMode(false);
              }}
              buttonPadding=" p-4 "
              // additionalStyles=" w-[280px] "
            />
          </span>
        </div>
      </form>

      <div className="order-[-1] ml-auto gap-x-2 flex justify-center items-start ">
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
