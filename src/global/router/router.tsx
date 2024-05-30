import { createBrowserRouter } from "react-router-dom";
import Layout from "../../pages/Layout.tsx";
import ProtectedPage from "./ProtectedPage/ProtectedPage.tsx";
import ErrorPage from "../../pages/ErrorPage/ErrorPage.tsx";
import Homepage from "../../pages/HomePage/HomePage.tsx";
import ProfilePage from "../../pages/ProfilePage/ProfilePage.tsx";
import DiaryPage from "../../pages/DiaryPage/DiaryPage.tsx";
import FoodPage from "../../pages/FoodPage/FoodPage.tsx";
import AuthorizationPage from "../../pages/AuthorizationPage/AuthorizationPage.tsx";
import RegistrationPage from "../../pages/RegistrationPage/RegistrationPage.tsx";

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
          element: <AuthorizationPage />,
        },
        {
          path: "register",
          element: <RegistrationPage />,
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
              <FoodPage />
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
