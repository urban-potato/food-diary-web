import * as yup from "yup";
import { useChangeUserInfoMutation } from "../api/user.api";
import { validValues } from "../constants/constants";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, useFormState } from "react-hook-form";
import IlluminatedButton from "../../../ui/IlluminatedButton.tsx";
import { Player } from "@lordicon/react";
import EDIT_ICON from "../../../global/assets/system-regular-63-settings-cog.json";
import { useEffect, useRef } from "react";
import IlluminatedInput from "../../../ui/IlluminatedInput.tsx";

const ProfileEdit = ({ id, email, firstName, lastName, setIsEditMode }) => {
  const [doChangeUserInfo, doChangeUserInfoResult] =
    useChangeUserInfoMutation();

  const editIconPlayerRef = useRef<Player>(null);
  const ICON_SIZE = 28;

  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .email(validValues.email.error)
      .required(`• Почта: ${validValues.requiredErrorMessage}`)
      .matches(
        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        validValues.email.error
      ),
    firstName: yup
      .string()
      .min(
        validValues.firstName.min.value,
        validValues.firstName.min.message(validValues.firstName.min.value)
      )
      .max(
        validValues.firstName.max.value,
        validValues.firstName.max.message(validValues.firstName.max.value)
      )
      .required(`• Имя: ${validValues.requiredErrorMessage}`),
    lastName: yup
      .string()
      .min(
        validValues.lastName.min.value,
        validValues.lastName.min.message(validValues.lastName.min.value)
      )
      .max(
        validValues.lastName.max.value,
        validValues.lastName.max.message(validValues.lastName.max.value)
      )
      .required(`• Фамилия: ${validValues.requiredErrorMessage}`),
  });

  let defaultValues = {
    email: email,
    firstName: firstName,
    lastName: lastName,
  };

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

  const onSubmit = async (data) => {
    let submitData = {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
    };

    try {
      const resultChangeUserInfo = doChangeUserInfo({
        id: id,
        data: submitData,
      });

      reset();
      setIsEditMode(false);
    } catch (error) {
      console.log("error");
      console.log(error);
      alert(error?.data?.title);
    }
  };

  let isFilledRight =
    getValues("email") &&
    getValues("firstName") &&
    getValues("lastName") &&
    !errors?.email &&
    !errors?.firstName &&
    !errors?.lastName
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
          <IlluminatedInput
            id="email"
            type="email"
            placeholder="Почта"
            register={{ ...register("email") }}
            // errorMessage={errors.name?.message}
            isError={errors.email ? true : false}
            // inset=" inset-0 "
            // bgError = "#F8E4EB"
            isRequired={true}
          />
        </div>

        <div className="text-xl">
          <IlluminatedInput
            id="firstName"
            type="text"
            placeholder="Имя"
            register={{ ...register("firstName") }}
            // errorMessage={errors.name?.message}
            isError={errors.firstName ? true : false}
            // inset=" inset-0 "
            // bgError = "#F8E4EB"
            isRequired={true}
          />
        </div>
        <div className="text-xl">
          <IlluminatedInput
            id="lastName"
            type="text"
            placeholder="Фамилия"
            register={{ ...register("lastName") }}
            // errorMessage={errors.name?.message}
            isError={errors.lastName ? true : false}
            // inset=" inset-0 "
            // bgError = "#F8E4EB"
            isRequired={true}
          />
        </div>

        <div
          className={
            Object.keys(errors).length > 0
              ? "  flex flex-col mt-5 px-5 gap-y-2 justify-center "
              : " hidden "
          }
        >
          <p className={errors.email ? "text-pink-500 " : " hidden "}>
            {errors.email?.message}
          </p>
          <p className={errors.firstName ? "text-pink-500 " : " hidden "}>
            {errors.firstName?.message}
          </p>
          <p className={errors.lastName ? "text-pink-500 " : " hidden "}>
            {errors.lastName?.message}
          </p>
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
              isButton={true}
              type="submit"
              buttonPadding=" p-4 "
              isDisabled={isFilledRight ? false : true}
              // additionalStyles=" w-[280px] "
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
      </div>
    </div>
  );
};

export default ProfileEdit;
