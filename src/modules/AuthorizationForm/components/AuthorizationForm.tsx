import { SubmitHandler, useForm, useFormState } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useIsAuth } from "../../../global/hooks/use-is-auth.hook.ts";
import { useLoginMutation } from "../api/authorization.api.ts";
import { setTokenToLocalStorage } from "../../../global/helpers/local-storage.helper.ts";
import { FC, useEffect } from "react";
import InputIlluminated from "../../../ui/InputIlluminated/InputIlluminated.tsx";
import { AuthorizationData } from "../types/AuthorizationForm.types.ts";
import { authorizationValidationSchema } from "../constants/AuthorizationForm.constants.ts";

const AuthorizationForm: FC = () => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
    getValues,
    control,
    trigger,
  } = useForm({
    resolver: yupResolver<AuthorizationData>(authorizationValidationSchema),
    mode: "onChange",
  });

  const { dirtyFields, touchedFields } = useFormState({ control });

  const navigate = useNavigate();

  const [doLogin] = useLoginMutation();

  const onSubmit: SubmitHandler<AuthorizationData> = async (data) => {
    const { email, password } = data;

    const loginData = {
      email: email,
      password: password,
    };

    await doLogin(loginData)
      .unwrap()
      .then((data) => {
        // console.log("doLogin data");
        // console.log(data);

        setTokenToLocalStorage(data.token, data.expiresIn);
      })
      .catch((e) => console.log(e));

    navigate("/diary");
    window.location.reload();

    reset();
  };

  const isAuth = useIsAuth();

  let isFilledRight =
    getValues("email") &&
    getValues("password") &&
    !errors?.email &&
    !errors?.password
      ? true
      : false;

  useEffect(() => {
    if (Object.keys(dirtyFields).length && !Object.keys(touchedFields).length) {
      trigger();
    }
  }, [dirtyFields, touchedFields]);

  return (
    <>
      {!isAuth ? (
        <section className="flex-grow flex flex-col gap-y-3 justify-center w-full max-w-md">
          <h2 className="mb-5">Войдите в аккаунт</h2>

          <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
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
                  [errors?.password?.message].filter(
                    (item) => !!item
                  ) as string[]
                }
              />
            </div>

            <div className="">
              <button
                type="submit"
                disabled={isFilledRight ? false : true}
                className={
                  isFilledRight
                    ? "btn btn_dark flex-grow"
                    : "btn btn_disabled flex-grow"
                }
              >
                Войти
              </button>

              <p className="truncate">
                Нет аккаунта?{" "}
                <Link
                  to="/register"
                  className="underline hover:text-light_near_black transition duration-1000 hover:duration-500"
                >
                  Зарегистрируйтесь
                </Link>
              </p>
            </div>
          </form>
        </section>
      ) : (
        <Navigate to="/diary" replace={true} />
      )}
    </>
  );
};

export default AuthorizationForm;
