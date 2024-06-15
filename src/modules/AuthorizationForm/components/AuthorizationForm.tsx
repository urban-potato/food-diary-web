import { SubmitHandler, useForm, useFormState } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useIsAuth } from "../../../global/hooks/use-is-auth.hook.ts";
import {
  useLazyGetMeQuery,
  useLoginMutation,
} from "../api/authorization.api.ts";
import { setTokenToLocalStorage } from "../../../global/helpers/local-storage.helper.ts";
import { FC, useEffect, useState } from "react";
import InputIlluminated from "../../../ui/InputIlluminated/InputIlluminated.tsx";
import { AuthorizationData } from "../types/AuthorizationForm.types.ts";
import { authorizationValidationSchema } from "../constants/AuthorizationForm.constants.ts";
import { notify } from "../../../global/helpers/notify.helper.tsx";
import { login, useLazyGetUserInfoQuery } from "../../UserInfoTile/index.ts";
import { useAppDispatch } from "../../../global/store/store-hooks.ts";
import LoaderWithBlock from "../../../components/LoaderWithBlock/LoaderWithBlock.tsx";

const AuthorizationForm: FC = () => {
  const [mainlIsLoading, setMainIsLoading] = useState(false);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isValid },
    control,
    trigger,
  } = useForm({
    resolver: yupResolver<AuthorizationData>(authorizationValidationSchema),
    mode: "onChange",
  });

  const { dirtyFields, touchedFields } = useFormState({ control });

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [doLogin] = useLoginMutation();
  const [doGetMe] = useLazyGetMeQuery();
  const [doGetUserInfo] = useLazyGetUserInfoQuery();

  const onSubmit: SubmitHandler<AuthorizationData> = async (data) => {
    setMainIsLoading(true);

    const { email, password } = data;

    const loginData = {
      email: email,
      password: password,
    };

    await doLogin(loginData)
      .unwrap()
      .then(async (data) => {
        setTokenToLocalStorage(data.token, data.expiresIn);

        await doGetMe(undefined)
          .unwrap()
          .then(async (data) => {
            await doGetUserInfo(data.id)
              .unwrap()
              .then((data) => {
                dispatch(login(data));

                reset();
                navigate("/diary");

                notify({
                  messageText: "Вы авторизованы",
                  toastId: "successAuthorizationNotification",
                  toastType: "success",
                });
              })
              .catch((error) => {
                let errorMessage =
                  "При получении данных пользователя произошла неизвестная ошибка :(";

                if (error?.status == "FETCH_ERROR") {
                  errorMessage = "Проблемы с интернет соединением";
                }

                notify({
                  messageText: errorMessage,
                  toastId: "errorNotification",
                  toastType: "error",
                });
              });
          })
          .catch((error) => {
            let errorMessage =
              "При авторизации произошла неизвестная ошибка :(";

            if (error?.status == 401) {
              errorMessage = "Не удалось войти в систему. Попробуйте снова";
            } else if (error?.status == 403) {
              errorMessage = "Отсутстуют права для выполнения операции";
            } else if (error?.status == "FETCH_ERROR") {
              errorMessage = "Проблемы с интернет соединением";
            }

            notify({
              messageText: errorMessage,
              toastId: "errorNotification",
              toastType: "error",
            });
          });
      })
      .catch((error) => {
        let errorMessage = "При авторизации произошла неизвестная ошибка :(";

        if (error?.data?.title?.includes("Email or password is incorrect")) {
          errorMessage = "Неверная почта или пароль";
        } else if (error?.data?.title?.includes("is locked out")) {
          errorMessage = "Эта почта заблокирована";
        } else if (error?.data?.title?.includes("is not allowed to Sign In")) {
          errorMessage = "Для этой почты вход запрещен";
        } else if (error?.status == "FETCH_ERROR") {
          errorMessage = "Проблемы с интернет соединением";
        }

        notify({
          messageText: errorMessage,
          toastId: "errorNotification",
          toastType: "error",
        });
      });

    setMainIsLoading(false);
  };

  const isAuth = useIsAuth();

  useEffect(() => {
    if (Object.keys(dirtyFields).length && !Object.keys(touchedFields).length) {
      trigger();
    }
  }, [dirtyFields, touchedFields]);

  if (isAuth) {
    return <Navigate to="/diary" replace />;
  }

  return (
    <section className="relative flex-grow flex flex-col gap-y-3 justify-center w-full max-w-md">
      {mainlIsLoading && (
        <LoaderWithBlock className="loader_with_block_auth_reg" />
      )}

      <h2 className="mb-5 break-words w-full">Войдите в аккаунт</h2>

      <form className="flex flex-col w-full" onSubmit={handleSubmit(onSubmit)}>
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
            isError={!!errors?.password}
            errorMessagesList={
              [errors?.password?.message].filter((item) => !!item) as string[]
            }
          />
        </div>

        <div className="w-full">
          <button
            type="submit"
            disabled={isValid ? false : true}
            className={
              isValid ? "btn btn_dark flex-grow" : "btn btn_disabled flex-grow"
            }
          >
            Войти
          </button>

          <div className="w-full overflow-hidden">
            <p className="break-words w-full">
              Нет аккаунта?{" "}
              <Link
                to="/register"
                className="underline hover:text-light_near_black transition duration-1000 hover:duration-500"
              >
                Зарегистрируйтесь
              </Link>
            </p>
          </div>
        </div>
      </form>
    </section>
  );
};

export default AuthorizationForm;
