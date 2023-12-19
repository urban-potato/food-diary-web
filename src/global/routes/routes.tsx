import { createBrowserRouter } from "react-router-dom";
import Layout from "../../pages/Layout";
import ProtectedPage from "./ProtectedPage/ProtectedPage.tsx";
import ErrorPage from "../../pages/ErrorPage/ErrorPage";
import Homepage from "../../pages/HomePage/HomePage";
import ProfilePage from "../../pages/ProfilePage/ProfilePage";
import DiaryPage from "../../pages/DiaryPage/DiaryPage";
import FoodPage from "../../pages/FoodPage/components/FoodPage/FoodPage.tsx";
import AuthorizationPage from "../../pages/AuthorizationPage/AuthorizationPage";
import RegistrationPage from "../../pages/RegistrationPage/RegistrationPage";

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
