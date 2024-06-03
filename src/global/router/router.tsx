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
          path: "/",
          element: <Homepage />,
          index: true,
        },
        {
          path: "/login",
          element: <AuthorizationPage />,
        },
        {
          path: "/register",
          element: <RegistrationPage />,
        },
        {
          element: <ProtectedPage />,
          children: [
            {
              path: "/profile",
              element: <ProfilePage />,
            },
            {
              path: "/diary/:date?",
              element: <DiaryPage />,
            },
            {
              path: "/food/:type?",
              element: <FoodPage />,
            },
          ],
        },
        {
          path: "*",
          element: <ErrorPage />,
        },
      ],
    },
  ]
  // {
  //   basename: "/foodDiary/",
  // }
);
