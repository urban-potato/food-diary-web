import { useChangeUserInfoMutation } from "../api/profile.api.ts";
import { editUserProfileInfoValidationSchema } from "../constants/UserInfoTile.constants.ts";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm, useFormState } from "react-hook-form";
import { FC, useEffect } from "react";
import ButtonIlluminated from "../../../ui/ButtonIlluminated/ButtonIlluminated.tsx";
import InputIlluminated from "../../../ui/InputIlluminated/InputIlluminated.tsx";

type TProps = {
  id: string;
  originalEmail: string;
  originalFirstName: string;
  originalLastName: string;
  setIsEditMode: Function;
};

type TSubmitData = {
  email?: string;
  firstName?: string;
  lastName?: string;
};

const UserInfoEditForm: FC<TProps> = ({
  id,
  originalEmail,
  originalFirstName,
  originalLastName,
  setIsEditMode,
}) => {
  const [doChangeUserInfo] = useChangeUserInfoMutation();

  let defaultValues = {
    email: originalEmail,
    firstName: originalFirstName,
    lastName: originalLastName,
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
    resolver: yupResolver(editUserProfileInfoValidationSchema),
    mode: "onChange",
    defaultValues: defaultValues,
  });

  const { dirtyFields, touchedFields } = useFormState({ control });

  const onSubmit: SubmitHandler<TSubmitData> = async (data) => {
    let submitData: TSubmitData = {};

    if (data.email != originalEmail) submitData.email = data.email;
    if (data.firstName != originalFirstName)
      submitData.firstName = data.firstName;
    if (data.lastName != originalLastName) submitData.lastName = data.lastName;

    try {
      await doChangeUserInfo({
        id: id,
        data: submitData,
      });

      reset();
      setIsEditMode(false);
    } catch (error: any) {
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
    <div className="w-full max-w-5xl flex flex-col justify-center items-start -mt-5">
      <form
        className="lex flex-col flex-wrap justify-center w-full"
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
      >
        <div className="flex flex-col w-full gap-1">
          <div className="w-full flex-grow">
            <InputIlluminated
              id="email"
              type="email"
              inputLabel="Почта"
              register={{ ...register("email") }}
              isRequired={true}
              className="h-[67px]"
            />

            {errors && (
              <div
                className={
                  Object.keys(errors).length > 0
                    ? "flex flex-col mt-1 justify-center items-start"
                    : "hidden"
                }
              >
                <p className={errors.email ? "text-pink-500 " : "hidden"}>
                  {errors.email?.message}
                </p>
              </div>
            )}
          </div>

          <div className="w-full flex-grow">
            <InputIlluminated
              id="firstName"
              type="text"
              inputLabel="Имя"
              register={{ ...register("firstName") }}
              isRequired={true}
              className="h-[67px]"
            />

            {errors && (
              <div
                className={
                  Object.keys(errors).length > 0
                    ? "flex flex-col mt-1 justify-center items-start"
                    : "hidden"
                }
              >
                <p className={errors.firstName ? "text-pink-500" : "hidden"}>
                  {errors.firstName?.message}
                </p>
              </div>
            )}
          </div>

          <div className="w-full flex-grow">
            <InputIlluminated
              id="lastName"
              type="text"
              inputLabel="Фамилия"
              register={{ ...register("lastName") }}
              isRequired={true}
              className="h-[67px]"
            />

            {errors && (
              <div
                className={
                  Object.keys(errors).length > 0
                    ? "flex flex-col mt-1 justify-center items-start"
                    : "hidden"
                }
              >
                <p className={errors.lastName ? "text-pink-500" : "hidden"}>
                  {errors.lastName?.message}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap w-full gap-x-4 gap-y-3 justify-stretch items-center">
          <span className="flex-grow">
            <ButtonIlluminated
              children={"Сохранить"}
              type="submit"
              isDisabled={isFilledRight ? false : true}
            />
          </span>
          <span className="flex-grow">
            <ButtonIlluminated
              children={"Отменить"}
              type="button"
              onClick={() => {
                setIsEditMode(false);
              }}
              buttonVariant={"light"}
            />
          </span>
        </div>
      </form>
    </div>
  );
};

export default UserInfoEditForm;
