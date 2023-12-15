import { createBrowserRouter } from "react-router-dom";
import Layout from "../../pages/Layout";
import ProtectedPage from "../../pages/ProtectedPage";
import ErrorPage from "../../pages/ErrorPage/ErrorPage";
import Homepage from "../../pages/HomePage/HomePage";
import ProfilePage from "../../pages/ProfilePage/ProfilePage";
// import Login from "../../pages/AuthPage/LoginPage";
// import Registration from "../../pages/AuthPage/RegistrationPage";

import {
  AuthorizationForm,
  RegistrationForm,
} from "../../modules/AuthorizationModule/index";
import DiaryPage from "../../pages/DiaryPage/DiaryPage";
import FoodPage from "../../pages/FoodPage/FoodPage";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Layout />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <Homepage />,
        },
        {
          path: "login",
          element: <AuthorizationForm />,
        },
        {
          path: "register",
          element: <RegistrationForm />,
        },
        {
          path: "profile",
          element: (
            <ProtectedPage>
              <ProfilePage />
            </ProtectedPage>
          ),
        },
        {
          path: "diary",
          element: (
            <ProtectedPage>
              <DiaryPage />
            </ProtectedPage>
          ),
        },
        {
          path: "food",
          element: (
            <ProtectedPage>
              <FoodPage/>
            </ProtectedPage>
          ),
        },
      ],
    },
  ]
  // {
  //   basename: "/foodDiary/",
  // }
);
