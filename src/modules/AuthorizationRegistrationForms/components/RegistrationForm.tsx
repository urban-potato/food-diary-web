import * as yup from "yup";
import {
  registrationValidationSchema,
  validValues,
} from "../constants/constants";
import { SubmitHandler, useForm, useFormState } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../global/store/hooks";
import { useIsAuth } from "../hooks/hooks";
import {
  useLoginMutation,
  useLazyGetMeQuery,
  useRegisterMutation,
} from "../api/auth.api";
import { useLazyGetUserInfoQuery } from "../../UserModule";
import { toast } from "react-hot-toast";
import { setTokenToLocalStorage } from "../../../global/helpers/local_storage.helper.ts";
import { FC, useEffect } from "react";
import InputIlluminated from "../../../ui/InputIlluminated/InputIlluminated.tsx";
import { login } from "../../UserModule";

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
    formState: { errors },
    getValues,
    control,
    trigger,
  } = useForm({
    resolver: yupResolver<FormType>(registrationValidationSchema),
    mode: "onChange",
  });

  const { dirtyFields, touchedFields } = useFormState({ control });

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [doLogin, doLoginResult] = useLoginMutation();
  const [doGetMe, doGetMeResult] = useLazyGetMeQuery();
  const [doGetUserInfo, doGetUserInfoResult] = useLazyGetUserInfoQuery();
  const [doRegister, doRegisterResult] = useRegisterMutation();

  const onSubmit: SubmitHandler<FormType> = async (data) => {
    const { email, password } = data;

    const registerData = {
      email: email,
      password: password,
    };

    // TODO: дорабатывать обработку получения негативных ответов сервера
    try {
      const result = await doRegister(registerData)
        .unwrap()
        .then(() => {
          doLogin(registerData)
            .unwrap()
            .then((data) => {
              console.log("doLogin data");
              console.log(data);

              console.log("doLoginResult");
              console.log(doLoginResult);

              console.log("data.token");
              console.log(data.token);

              setTokenToLocalStorage(data.token, data.expiresIn);

              doGetMe(undefined)
                .unwrap()
                .then((data) => {
                  console.log("doGetMe data");
                  console.log(data);

                  doGetUserInfo(data.id)
                    .unwrap()
                    .then((data) => {
                      console.log("doGetUserInfo data");
                      console.log(data);

                      dispatch(login(data));
                    })
                    .catch((e) => console.log(e));
                })
                .catch((e) => console.log(e));
            })
            .catch((e) => console.log(e));

          toast.success("Вы зарегистрированы");
          navigate("/diary");

          reset();
        });
    } catch (error: any) {
      console.log("error");
      console.log(error);
      alert(error?.data?.title);
    }
  };

  const isAuth = useIsAuth();

  let isFilledRight =
    getValues("email") &&
    getValues("password") &&
    getValues("passwordConfirmation") &&
    !errors?.email &&
    !errors?.password &&
    !errors?.passwordConfirmation
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
          <h2 className="mb-5">Зарегистрируйтесь в FoodDiary</h2>

          <form className="" onSubmit={handleSubmit(onSubmit)}>
            <div className="w-full flex-grow">
              <InputIlluminated
                id="email"
                type="email"
                inputLabel="Почта"
                register={{ ...register("email") }}
                // errorMessage={errors.email?.message}
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
                  <p
                    className={
                      errors.email ? "text-pink-500 truncate" : "hidden"
                    }
                  >
                    {errors.email?.message}
                  </p>
                </div>
              )}
            </div>

            <div className="w-full flex-grow mt-3">
              <InputIlluminated
                id="password"
                type="password"
                inputLabel="Пароль"
                register={{ ...register("password") }}
                // errorMessage={errors.password?.message}
                isError={errors.password ? true : false}
                isRequired={true}
                autoComplete="new-password"
              />

              {errors && (
                <div
                  className={
                    Object.keys(errors).length > 0
                      ? "flex flex-col mt-1 justify-center items-start"
                      : "hidden"
                  }
                >
                  <p className={errors.password ? "text-pink-500" : "hidden"}>
                    {errors.password?.message}
                  </p>
                </div>
              )}
            </div>

            <div className="w-full flex-grow mt-3">
              <InputIlluminated
                id="passwordConfirmation"
                type="password"
                inputLabel="Повторите пароль"
                register={{ ...register("passwordConfirmation") }}
                // errorMessage={errors.passwordConfirmation?.message}
                isError={errors.passwordConfirmation ? true : false}
                isRequired={true}
                autoComplete="new-password"
              />

              {errors && (
                <div
                  className={
                    Object.keys(errors).length > 0
                      ? "flex flex-col mt-1 justify-center items-start"
                      : "hidden"
                  }
                >
                  <p
                    className={
                      errors.passwordConfirmation
                        ? "text-pink-500 "
                        : " hidden "
                    }
                  >
                    {errors.passwordConfirmation?.message}
                  </p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isFilledRight ? false : true}
              className={
                isFilledRight
                  ? "btn btn_dark flex-grow"
                  : "btn btn_disabled flex-grow "
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
      ) : (
        <Navigate to="/" replace={true} />
      )}
    </>
  );
};

export default RegistrationForm;
