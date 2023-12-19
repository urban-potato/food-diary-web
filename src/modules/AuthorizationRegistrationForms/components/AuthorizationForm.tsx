import * as yup from "yup";
import { validValues } from "../constants/constants";
import { SubmitHandler, useForm, useFormState } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../global/store/hooks";
import { useIsAuth } from "../hooks/hooks";
import { useLoginMutation, useLazyGetMeQuery } from "../api/auth.api";
import { useLazyGetUserInfoQuery, login } from "../../UserModule";
import { toast } from "react-hot-toast";
import { setTokenToLocalStorage } from "../../../global/helpers/local_storage.helper";
import { FC, useEffect } from "react";
import InputIlluminated from "../../../ui/InputIlluminated/InputIlluminated.tsx";
import { AuthorizationData } from "../types/types";

const AuthorizationForm: FC = () => {
  const validationSchema = yup.object<AuthorizationData>().shape({
    email: yup
      .string()
      .email(validValues.email.error)
      .required(`• Почта: ${validValues.requiredErrorMessage}`)
      .matches(
        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        validValues.email.error
      ),
    password: yup
      .string()
      .min(
        validValues.password.min.value,
        validValues.password.min.message(validValues.password.min.value)
      )
      .max(
        validValues.password.max.value,
        validValues.password.max.message(validValues.password.max.value)
      )
      .required(`• Пароль: ${validValues.requiredErrorMessage}`),
  });

  // TODO: ИЗУЧИТЬ useForm и yup
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
  });

  const { dirtyFields, touchedFields } = useFormState({ control });

  // TODO: ИЗУЧИТЬ useNavigate
  const navigate = useNavigate();
  // TODO: ИЗУЧИТЬ useAppDispatch
  const dispatch = useAppDispatch();

  const [doLogin, doLoginResult] = useLoginMutation();
  const [doGetMe, doGetMeResult] = useLazyGetMeQuery();
  const [doGetUserInfo, doGetUserInfoResult] = useLazyGetUserInfoQuery();

  // TODO: ИЗУЧИТЬ SubmitHandler<AuthorizationFormType>
  const onSubmit: SubmitHandler<AuthorizationData> = async (data) => {
    const { email, password } = data;

    const loginData = {
      email: email,
      password: password,
    };

    // TODO: дорабатывать обработку получения негативных ответов сервера
    // TODO: ИЗУЧИТЬ .unwrap()
    try {
      const result = await doLogin(loginData)
        .unwrap()
        .then((data) => {
          // console.log("doLogin data");
          // console.log(data);

          // console.log("doLoginResult");
          // console.log(doLoginResult);

          // console.log("data.token");
          // console.log(data.token);

          setTokenToLocalStorage(data.token);

          doGetMe(undefined)
            .unwrap()
            .then((data) => {
              // console.log("doGetMe data");
              // console.log(data);

              doGetUserInfo(data.id)
                .unwrap()
                .then((data) => {
                  // console.log("doGetUserInfo data");
                  // console.log(data);

                  dispatch(login(data));
                })
                .catch((e) => console.log(e));
            })
            .catch((e) => console.log(e));

          // TODO: ИЗУЧИТЬ toast
          toast.success("Вы авторизированы");

          window.location.reload();
          navigate("/diary");

          reset();
        });
    } catch (error: any) {
      console.log("error");
      console.log(error);
      alert(error?.data?.title);
    }
  };

  // TODO: ИЗУЧИТЬ useAppSelector
  const isAuth = useIsAuth();

  let isFilledRight =
    getValues("email") &&
    getValues("password") &&
    !errors?.email &&
    !errors?.password
      ? true
      : false;

  console.log("getValues(email)");
  console.log(getValues("email"));

  useEffect(() => {
    if (Object.keys(dirtyFields).length && !Object.keys(touchedFields).length) {
      trigger();
    }
  }, [dirtyFields, touchedFields]);

  //--------------------------------------------------------

  // TODO: ИЗУЧИТЬ получше кастомный InputIlluminated
  return (
    <>
      {!isAuth ? (
        <section
          className=" 
        flex-grow 
        
        flex flex-col gap-y-3 

        justify-center

        w-full max-w-md
        "
        >
          <h2 className="">Войдите в аккаунт</h2>

          <form className="" onSubmit={handleSubmit(onSubmit)}>
            <InputIlluminated
              id="email"
              type="email"
              placeholder="Почта"
              register={{ ...register("email") }}
              // errorMessage={errors.email?.message}
              isError={errors.email ? true : false}
              isRequired={true}
            />

            <InputIlluminated
              id="password"
              type="password"
              placeholder="Пароль"
              register={{ ...register("password") }}
              // errorMessage={errors.password?.message}
              isError={errors.password ? true : false}
              isRequired={true}
            />

            <div
              className={
                Object.keys(errors).length > 0
                  ? "  flex flex-col mt-5 px-2 gap-y-2 justify-center "
                  : " hidden "
              }
            >
              <p className={errors.email ? "text-pink-500 " : " hidden "}>
                {errors.email?.message}
              </p>
              <p className={errors.password ? "text-pink-500 " : " hidden "}>
                {errors.password?.message}
              </p>
            </div>

            <div className="">
              {/* <input type="submit" value="Войти" className="" /> */}

              <button
                type="submit"
                disabled={isFilledRight ? false : true}
                className={
                  isFilledRight
                    ? "btn btn_dark flex-grow"
                    : "btn btn_disabled flex-grow "
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