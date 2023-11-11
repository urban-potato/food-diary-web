import * as yup from "yup";
import { validValues } from "../constants/constants";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../global/store/hooks";
import { useIsAuth } from "../hooks/hooks";
import { useLoginMutation, useLazyGetMeQuery } from "../api/auth.api";
import { useLazyGetUserInfoQuery } from "../../UserModule/api/user.api";
import { toast } from "react-hot-toast";
import { login } from "../../UserModule/slices/userSlice";
import { setTokenToLocalStorage } from "../../../global/helpers/local_storage.helper";
import { FC } from "react";
import Input from "../../../ui/input";
import styles from "./AuthorizationForm.module.css";
import { VscChromeClose } from "react-icons/Vsc";

interface FormType {
  email: string;
  password: string;
}

const AuthorizationForm: FC = () => {
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
  });

  // TODO: ИЗУЧИТЬ useForm и yup
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });
  // TODO: ИЗУЧИТЬ useNavigate
  const navigate = useNavigate();
  // TODO: ИЗУЧИТЬ useAppDispatch
  const dispatch = useAppDispatch();

  const [doLogin, doLoginResult] = useLoginMutation();
  const [doGetMe, doGetMeResult] = useLazyGetMeQuery();
  const [doGetUserInfo, doGetUserInfoResult] = useLazyGetUserInfoQuery();

  // TODO: ИЗУЧИТЬ SubmitHandler<FormType>
  const onSubmit: SubmitHandler<FormType> = async (data) => {
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

          // TODO: ИЗУЧИТЬ toast
          toast.success("Вы авторизированы");
          navigate("/diary");

          reset();
        });
    } catch (error) {
      console.log("error");
      console.log(error);
      alert(error?.data?.title);
    }
  };

  // TODO: ИЗУЧИТЬ useAppSelector
  const isAuth = useIsAuth();

  //--------------------------------------------------------

  // TODO: ИЗУЧИТЬ получше кастомный Input
  return (
    <>
      {!isAuth ? (
        <section>
          <header className={styles.header}>
            <h3>Войти в аккаунт</h3>
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

            <div className={styles.divSubmit}>
              <input type="submit" value="Войти" className={styles.btnSubmit} />

              <p className={styles.textUnderSubmit}>
                У вас нет аккаунта?{" "}
                <Link to="/register" className={styles.linkToRegister}>
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
