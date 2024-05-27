import { useChangeUserInfoMutation } from "../../api/user.api.ts";
import { editUserProfileInfoValidationSchema } from "../../constants/constants.ts";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm, useFormState } from "react-hook-form";
import { FC, useEffect } from "react";
import ButtonIlluminated from "../../../../ui/ButtonIlluminated/ButtonIlluminated.tsx";
import InputIlluminated from "../../../../ui/InputIlluminated/InputIlluminated.tsx";
import { UserData } from "../../types/types.ts";

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

const UserProfileInfoEditForm: FC<TProps> = ({
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

  const onSubmit: SubmitHandler<UserData> = async (data) => {
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
      >
        <div className="flex flex-col w-full gap-1">
          <div className="w-full flex-grow">
            <InputIlluminated
              id="email"
              type="email"
              inputLabel="Почта"
              disableIllumination={true}
              additionalStyles=" h-[67px] border-0 "
              register={{ ...register("email") }}
              isError={errors.email ? true : false}
              isRequired={true}
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
              disableIllumination={true}
              additionalStyles=" h-[67px] border-0 "
              register={{ ...register("firstName") }}
              isError={errors.firstName ? true : false}
              isRequired={true}
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
              disableIllumination={true}
              additionalStyles=" h-[67px] border-0 "
              register={{ ...register("lastName") }}
              isError={errors.lastName ? true : false}
              isRequired={true}
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
              label="Сохранить"
              isDarkButton={true}
              isIlluminationFull={false}
              isButton={true}
              type="submit"
              isDisabled={isFilledRight ? false : true}
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

export default UserProfileInfoEditForm;
