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
import { VscChromeClose } from "react-icons/Vsc";
import { FaAngleLeft } from "react-icons/fa6";
import { AuthorizationFormType } from "../types/types";



const AuthorizationForm: FC = () => {
  const validationSchema = yup.object<AuthorizationFormType>().shape({
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

  // TODO: ИЗУЧИТЬ SubmitHandler<AuthorizationFormType>
  const onSubmit: SubmitHandler<AuthorizationFormType> = async (data) => {
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
        <section
          className=" 
        flex-grow max-w-[416px] min-w-[130px]
        
        flex flex-col gap-y-3 
        "
        >
          {/* <button className="small_btn btn_colored" onClick={() => navigate(-1)}>
            <FaAngleLeft className="" />
          </button> */}

          <h2 className="">Войдите в аккаунт</h2>

          <form className="" onSubmit={handleSubmit(onSubmit)}>
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

            <div className="">
              {/* <input type="submit" value="Войти" className="" /> */}

              <button type="submit" className="btn btn_dark">
                Войти
              </button>

              {/* <p className="">
                Нет аккаунта?{" "}
                <Link to="/register" className="">
                  <p className="truncate underline">Зарегистрируйтесь</p>
                </Link>
              </p> */}

              <p className="truncate">
                Нет аккаунта?{" "}
                <Link to="/register" className="underline hover:text-light_near_black transition duration-1000 hover:duration-200">
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
