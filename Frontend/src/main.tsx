/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import "./index.scss";
import "react-toastify/dist/ReactToastify.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LayoutMain from "./layouts/LayoutMain.tsx";
import store from "./store/store.ts";
import App from "./App.tsx";
import { ToastContainer } from "react-toastify";
import Loading from "./components/common/Loading.tsx";
import { Analytics } from "@vercel/analytics/react"
import "./locales";

import { AuthProvider } from "./contexts/auth-context.tsx";
import { AuthContextType } from "./types/common.ts";

const HomePage = lazy(() => import("./pages/HomePage.tsx"));
const LoginPage = lazy(() => import("./pages/LoginPage.tsx"));
const SignUpPage = lazy(() => import("./pages/SignUpPage.tsx"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage.tsx"));
const CarDetailPage = lazy(() => import("./pages/CarDetailPage.tsx"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage.tsx"));
const AccountPage = lazy(() => import("./pages/AccountPage.tsx"));
const AccountDetails = lazy(() => import("./modules/account/AccountDetails.tsx"));
const FavoriteCars = lazy(() => import("./modules/account/FavoriteCars.tsx"));
const MyCars = lazy(() => import("./modules/account/MyCars.tsx"));
const MyTrips = lazy(() => import("./modules/account/MyTrips.tsx"));
const MyAddress = lazy(() => import("./modules/account/MyAddress.tsx"));
const ChangePassword = lazy(() => import("./modules/account/ChangePassword.tsx"));
const MyLessee = lazy(() => import("./modules/account/MyLessee.tsx"));
const LesseeContract = lazy(() => import("./modules/account/LesseeContract.tsx"));
const LessorContract = lazy(() => import("./modules/account/LessorContract.tsx"));
const PaymentCallBackPage = lazy(() => import("./pages/PaymentCallBackPage.tsx"));
const MyCarDetails = lazy(() => import("./pages/MyCarDetails.tsx"));
const ListCarPage = lazy(() => import("./pages/ListCarPage.tsx"));
const router = createBrowserRouter([
  {
    element: <LayoutMain />,
    children: [
      {
        path: "/",
        element: <Suspense fallback={<Loading />}><HomePage /></Suspense>,
      },
      {
        path: "/car/:id",
        element: <Suspense fallback={<Loading />}><CarDetailPage /></Suspense>,
      },
      {
        path: "/checkout",
        element: <Suspense fallback={<Loading />}><CheckoutPage /></Suspense>
      },
      {
        path: "/account",
        element: <Suspense fallback={<Loading />}><AccountPage /></Suspense>,
        children: [
          {
            path: "",
            element: <Suspense fallback={<Loading />}><AccountDetails /></Suspense>,
          },
          {
            path: "favorite",
            element: <Suspense fallback={<Loading />}><FavoriteCars /></Suspense>,
          },
          {
            path: "my-cars",
            element: <Suspense fallback={<Loading />}><MyCars /></Suspense>,
          },
          {
            path: "my-cars/:id",
            element: <Suspense fallback={<Loading />}><MyCarDetails /></Suspense>,
          },
          {
            path: "my-trips",
            element: <Suspense fallback={<Loading />}><MyTrips /></Suspense>,
          },
          {
            path: "my-trips/:id",
            element: <Suspense fallback={<Loading />}><MyTrips /></Suspense>,
          },
          {
            path: "my-car-lessee",
            element: <Suspense fallback={<Loading />}><MyLessee /></Suspense>,
          },
          {
            path: "my-car-lessee/:id",
            element: <Suspense fallback={<Loading />}><MyLessee /></Suspense>,
          },
          {
            path: 'lessee-contract',
            element: <Suspense fallback={<Loading />}><LesseeContract /></Suspense>
          },
          {
            path: 'lessee-contract/:id',
            element: <Suspense fallback={<Loading />}><LesseeContract /></Suspense>
          },
          {
            path: 'lessor-contract',
            element: <Suspense fallback={<Loading />}><LessorContract /></Suspense>
          },
          {
            path: 'lessor-contract/:id',
            element: <Suspense fallback={<Loading />}><LessorContract /></Suspense>
          },
          {
            path: "my-address",
            element: <Suspense fallback={<Loading />}><MyAddress /></Suspense>,
          },
          {
            path: "change-password",
            element: <Suspense fallback={<Loading />}><ChangePassword /></Suspense>,
          },
        ],
      },
      {
        path: "/cars/filter",
        element: <Suspense fallback={<Loading />}><ListCarPage /></Suspense>,
      },
      {
        path: 'payment_callback',
        element: <Suspense fallback={<Loading />}><PaymentCallBackPage /></Suspense>
      }
    ],
  },
  {
    element: <Suspense fallback={<Loading />}><LoginPage /></Suspense>,
    path: "/signin",
  },
  {
    element: <Suspense fallback={<Loading />}><SignUpPage /></Suspense>,
    path: "/signup",
  },
  { path: "*", element: <Suspense fallback={<Loading />}><NotFoundPage /></Suspense> },
]);

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <AuthProvider value={{} as AuthContextType}>
      <App>
        <RouterProvider router={router}></RouterProvider>
      </App>
      <ToastContainer bodyClassName="font-primary text-sm"></ToastContainer>
      <Analytics />
    </AuthProvider>
  </Provider>
);