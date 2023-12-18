import * as yup from "yup";
import { validValues } from "../constants/constants";
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
import { useLazyGetUserInfoQuery } from "../../UserModule/index";
import { toast } from "react-hot-toast";
import { setTokenToLocalStorage } from "../../../global/helpers/local_storage.helper";
import { FC, useEffect } from "react";
import IlluminatedInput from "../../../ui/IlluminatedInput.tsx";
import { login } from "../../UserModule/slices/userSlice";

interface FormType {
  email: string;
  password: string;
  passwordConfirmation: string;
}

const RegistrationForm: FC = () => {
  const validationSchema = yup.object<FormType>().shape({
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
    passwordConfirmation: yup
      .string()
      // .min(
      //   validValues.passwordConfirmation.min.value,
      //   validValues.passwordConfirmation.min.message(validValues.passwordConfirmation.min.value)
      // )
      // .max(
      //   validValues.passwordConfirmation.max.value,
      //   validValues.passwordConfirmation.max.message(validValues.passwordConfirmation.max.value)
      // )
      .required(`• Повторите пароль: ${validValues.requiredErrorMessage}`)
      .oneOf([yup.ref("password")], validValues.passwordsMustMatchMessage),
  });

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

              setTokenToLocalStorage(data.token);

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
    } catch (error) {
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
        <section
          className=" 
        flex-grow 
        flex flex-col gap-y-3 
        justify-center
        w-full max-w-md
     
        "
        >
          <h2 className="">Зарегистрируйтесь в FoodDiary</h2>

          <form className="" onSubmit={handleSubmit(onSubmit)}>
            <IlluminatedInput
              id="email"
              type="email"
              placeholder="Почта"
              register={{ ...register("email") }}
              // errorMessage={errors.email?.message}
              isError={errors.email ? true : false}
              isRequired={true}
            />

            <IlluminatedInput
              id="password"
              type="password"
              placeholder="Пароль"
              register={{ ...register("password") }}
              // errorMessage={errors.password?.message}
              isError={errors.password ? true : false}
              isRequired={true}
            />

            <IlluminatedInput
              id="passwordConfirmation"
              type="password"
              placeholder="Повторите пароль"
              register={{ ...register("passwordConfirmation") }}
              // errorMessage={errors.passwordConfirmation?.message}
              isError={errors.passwordConfirmation ? true : false}
              isRequired={true}
            />

            <div
              className={
                Object.keys(errors).length > 0
                  ? "  flex flex-col mt-5 px-2 gap-y-2 justify-center "
                  : " hidden "
              }
            >
              <p
                className={errors.email ? "text-pink-500 truncate" : " hidden "}
              >
                {errors.email?.message}
              </p>
              <p className={errors.password ? "text-pink-500 " : " hidden "}>
                {errors.password?.message}
              </p>
              <p
                className={
                  errors.passwordConfirmation ? "text-pink-500 " : " hidden "
                }
              >
                {errors.passwordConfirmation?.message}
              </p>
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
