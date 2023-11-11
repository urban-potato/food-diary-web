import * as yup from "yup";
import { validValues } from "../constants/constants";
import { SubmitHandler, useForm } from "react-hook-form";
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
import { FC } from "react";
import Input from "../../../ui/input";
import styles from "./RegustrationForm.module.css";
import { VscChromeClose } from "react-icons/Vsc";
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
      .required(validValues.requiredMessage)
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
        validValues.password.max.message(validValues.password.min.value)
      )
      .required(validValues.requiredMessage),
    passwordConfirmation: yup
      .string()
      // .min(
      //   validValues.passwordConfirmation.min.value,
      //   validValues.passwordConfirmation.min.message(validValues.passwordConfirmation.min.value)
      // )
      // .max(
      //   validValues.passwordConfirmation.max.value,
      //   validValues.passwordConfirmation.max.message(validValues.passwordConfirmation.min.value)
      // )
      .required(validValues.requiredMessage)
      .oneOf([yup.ref("password")], validValues.passwordsMustMatchMessage),
  });

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

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

  return (
    <>
      {!isAuth ? (
        <section>
          <header className={styles.header}>
            <h3>Зарегистрироваться</h3>
            {/* <button onClick={() => navigate(-1)}>
              <VscChromeClose />
            </button> */}
          </header>

          <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <Input
              id="email"
              type="email"
              placeholder="Почта"
              register={{ ...register("email") }}
              errorMessage={errors.email?.message}
            />

            <Input
              id="password"
              type="password"
              placeholder="Пароль"
              register={{ ...register("password") }}
              errorMessage={errors.password?.message}
            />

            <Input
              id="passwordConfirmation"
              type="password"
              placeholder="Повторите пароль"
              register={{ ...register("passwordConfirmation") }}
              errorMessage={errors.passwordConfirmation?.message}
            />

            <div className={styles.divSubmit}>
              <input
                type="submit"
                value="Зарегистрироваться"
                className={styles.btnSubmit}
              />

              <p className={styles.textUnderSubmit}>
                Есть аккаунт?
                {/* {error ? <div className={}>{error}</div> : null} */}
                <Link to="/login" className={styles.linkToRegister}>
                  Войдите
                </Link>
              </p>
            </div>
          </form>
        </section>
      ) : (
        <Navigate to="/" replace={true} />
      )}
    </>
  );
};

export default RegistrationForm;
