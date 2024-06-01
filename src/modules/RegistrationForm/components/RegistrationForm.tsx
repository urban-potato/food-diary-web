import { SubmitHandler, useForm, useFormState } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../global/store/store-hooks.ts";
import { useIsAuth } from "../../../global/hooks/use-is-auth.hook.ts";
import {
  useLoginMutation,
  useLazyGetMeQuery,
} from "../../AuthorizationForm/api/authorization.api.ts";
import { useLazyGetUserInfoQuery } from "../../UserInfoTile/index.ts";
import { setTokenToLocalStorage } from "../../../global/helpers/local-storage.helper.ts";
import { FC, useEffect } from "react";
import InputIlluminated from "../../../ui/InputIlluminated/InputIlluminated.tsx";
import { login } from "../../UserInfoTile/index.ts";
import { registrationValidationSchema } from "../constants/RegistrationForm.constants.ts";
import { useRegisterMutation } from "../api/registration.api.ts";
import { notify } from "../../../global/helpers/notify.helper.tsx";
import Toaster from "../../../ui/Toaster/Toaster.tsx";

interface FormType {
  email: string;
  password: string;
  passwordConfirmation: string;
}

const RegistrationForm: FC = () => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isValid },
    control,
    trigger,
  } = useForm({
    resolver: yupResolver<FormType>(registrationValidationSchema),
    mode: "onChange",
  });

  const { dirtyFields, touchedFields } = useFormState({ control });

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [doLogin] = useLoginMutation();
  const [doGetMe] = useLazyGetMeQuery();
  const [doGetUserInfo] = useLazyGetUserInfoQuery();
  const [doRegister] = useRegisterMutation();

  const onSubmit: SubmitHandler<FormType> = async (data) => {
    const { email, password } = data;

    const registerData = {
      email: email,
      password: password,
    };

    await doRegister(registerData)
      .unwrap()
      .then(() => {
        doLogin(registerData)
          .unwrap()
          .then((data) => {
            setTokenToLocalStorage(data.token, data.expiresIn);

            doGetMe(undefined)
              .unwrap()
              .then((data) => {
                doGetUserInfo(data.id)
                  .unwrap()
                  .then((data) => {
                    dispatch(login(data));
                  })
                  .catch((error) => {
                    let errorMessage = "Произошла неизвестная ошибка :(";

                    if (error?.status == "FETCH_ERROR") {
                      errorMessage =
                        "Сервер временно недоступен, попробуйте позже";
                    }

                    notify({
                      messageText: errorMessage,
                      toastId: "errorNotification",
                      toastType: "error",
                    });
                  });
              })
              .catch((error) => {
                let errorMessage = "Произошла неизвестная ошибка :(";

                if (error?.status == 401 || error?.status == 403) {
                  errorMessage = "Требуется авторизация";
                } else if (error?.status == "FETCH_ERROR") {
                  errorMessage = "Сервер временно недоступен, попробуйте позже";
                }

                notify({
                  messageText: errorMessage,
                  toastId: "errorNotification",
                  toastType: "error",
                });
              });
          })
          .catch((error) => {
            let errorMessage = "Произошла неизвестная ошибка :(";

            if (
              error?.data?.title?.includes("Email or password is incorrect")
            ) {
              errorMessage = "Неверная почта или пароль";
            } else if (error?.data?.title?.includes("is locked out")) {
              errorMessage = "Эта почта заблокирована";
            } else if (
              error?.data?.title?.includes("is not allowed to Sign In")
            ) {
              errorMessage = "Для этой почты вход запрещен";
            } else if (error?.status == "FETCH_ERROR") {
              errorMessage = "Сервер временно недоступен, попробуйте позже";
            }

            notify({
              messageText: errorMessage,
              toastId: "errorNotification",
              toastType: "error",
            });
          });

        navigate("/diary");
        reset();
      })
      .catch((error) => {
        let errorMessage = "Произошла неизвестная ошибка :(";

        if (error?.status == 400) {
          errorMessage = "Уже существует пользователь с этой почтой";
        } else if (error?.status == "FETCH_ERROR") {
          errorMessage = "Сервер временно недоступен, попробуйте позже";
        }

        notify({
          messageText: errorMessage,
          toastId: "errorNotification",
          toastType: "error",
        });
      });
  };

  const isAuth = useIsAuth();

  useEffect(() => {
    if (Object.keys(dirtyFields).length && !Object.keys(touchedFields).length) {
      trigger();
    }
  }, [dirtyFields, touchedFields]);

  if (isAuth) {
    return <Navigate to="/diary" replace={true} />;
  }

  return (
    <section className="flex-grow flex flex-col gap-y-3 justify-center w-full max-w-md">
      <Toaster />
      <h2 className="mb-5">Зарегистрируйтесь в FoodDiary</h2>

      <form className="" onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full flex-grow">
          <InputIlluminated
            id="email"
            type="email"
            inputLabel="Почта"
            register={{ ...register("email") }}
            isRequired={true}
            illuminationVariant={"base"}
            isError={!!errors?.email}
            errorMessagesList={
              [errors?.email?.message].filter((item) => !!item) as string[]
            }
          />
        </div>

        <div className="w-full flex-grow mt-3">
          <InputIlluminated
            id="password"
            type="password"
            inputLabel="Пароль"
            register={{ ...register("password") }}
            isRequired={true}
            illuminationVariant={"base"}
            autoComplete="new-password"
            isError={!!errors?.password}
            errorMessagesList={
              [errors?.password?.message].filter((item) => !!item) as string[]
            }
          />
        </div>

        <div className="w-full flex-grow mt-3">
          <InputIlluminated
            id="passwordConfirmation"
            type="password"
            inputLabel="Повторите пароль"
            register={{ ...register("passwordConfirmation") }}
            isRequired={true}
            illuminationVariant={"base"}
            autoComplete="new-password"
            isError={!!errors?.passwordConfirmation}
            errorMessagesList={
              [errors?.passwordConfirmation?.message].filter(
                (item) => !!item
              ) as string[]
            }
          />
        </div>

        <button
          type="submit"
          disabled={isValid ? false : true}
          className={
            isValid ? "btn btn_dark flex-grow" : "btn btn_disabled flex-grow "
          }
        >
          Зарегистрироваться
        </button>

        <p className="truncate">
          Есть аккаунт?{" "}
          <Link
            to="/login"
            className="underline hover:text-light_near_black transition duration-1000 hover:duration-500"
          >
            Войдите
          </Link>
        </p>
      </form>
    </section>
  );
};

export default RegistrationForm;
