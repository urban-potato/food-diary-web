import { useChangeUserInfoMutation } from "../api/profile.api.ts";
import { editUserProfileInfoValidationSchema } from "../constants/UserInfoTile.constants.ts";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm, useFormState } from "react-hook-form";
import { FC, useEffect } from "react";
import ButtonIlluminated from "../../../ui/ButtonIlluminated/ButtonIlluminated.tsx";
import InputIlluminated from "../../../ui/InputIlluminated/InputIlluminated.tsx";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../global/store/store-hooks.ts";
import { handleApiCallError } from "../../../global/helpers/handle-api-call-error.helper.ts";

type TProps = {
  id: string;
  originalEmail: string;
  originalFirstName: string;
  originalLastName: string;
  setIsEditMode: Function;
  isEditMode: boolean;
  setMainIsLoading: Function;
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
  isEditMode,
  setMainIsLoading,
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
    formState: { errors, isValid },
    control,
    trigger,
  } = useForm({
    resolver: yupResolver(editUserProfileInfoValidationSchema),
    mode: "onChange",
    defaultValues: defaultValues,
  });

  const { dirtyFields, touchedFields } = useFormState({ control });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<TSubmitData> = async (data) => {
    setMainIsLoading(true);

    let submitData: TSubmitData = {};

    if (data.email != originalEmail) submitData.email = data.email;
    if (data.firstName != originalFirstName)
      submitData.firstName = data.firstName;
    if (data.lastName != originalLastName) submitData.lastName = data.lastName;

    const changeUserInfoData = {
      id: id,
      data: submitData,
    };

    await doChangeUserInfo(changeUserInfoData)
      .unwrap()
      .catch((error) => {
        handleApiCallError({
          error: error,
          dispatch: dispatch,
          navigate: navigate,
        });
      });

    setMainIsLoading(false);
    reset();
    setIsEditMode(!isEditMode);
  };

  useEffect(() => {
    if (Object.keys(dirtyFields).length && !Object.keys(touchedFields).length) {
      trigger();
    }
  }, [dirtyFields, touchedFields]);

  return (
    <div className="w-full max-w-5xl flex flex-col justify-center items-start">
      <form
        className="lex flex-col flex-wrap justify-center w-full"
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
      >
        <div className="flex flex-col w-full gap-1">
          {/* <div className="w-full flex-grow">
            <InputIlluminated
              id="email"
              type="email"
              inputLabel="Почта"
              register={{ ...register("email") }}
              isRequired={true}
              className="h-[67px]"
              isError={!!errors?.email}
              errorMessagesList={
                [errors?.email?.message].filter((item) => !!item) as string[]
              }
            />
          </div> */}

          <div className="w-full flex-grow">
            <InputIlluminated
              id="firstName"
              type="text"
              inputLabel="Имя"
              register={{ ...register("firstName") }}
              isRequired={true}
              className="h-[67px]"
              isError={!!errors?.firstName}
              errorMessagesList={
                [errors?.firstName?.message].filter(
                  (item) => !!item
                ) as string[]
              }
            />
          </div>

          <div className="w-full flex-grow">
            <InputIlluminated
              id="lastName"
              type="text"
              inputLabel="Фамилия"
              register={{ ...register("lastName") }}
              isRequired={true}
              className="h-[67px]"
              isError={!!errors?.lastName}
              errorMessagesList={
                [errors?.lastName?.message].filter((item) => !!item) as string[]
              }
            />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap w-full gap-x-4 gap-y-3 justify-stretch items-center">
          <span className="flex-grow">
            <ButtonIlluminated
              children={"Сохранить"}
              type="submit"
              isDisabled={isValid ? false : true}
            />
          </span>
          <span className="flex-grow">
            <ButtonIlluminated
              children={"Отменить"}
              type="button"
              onClick={() => {
                setIsEditMode(!isEditMode);
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
