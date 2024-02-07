import { createBrowserRouter } from "react-router-dom";
import Root from "../layouts/root";
import Error from "../pages/error/error";
import Signup from "../pages/signup/signup";
import PublicRoutes from "../layouts/public-routes";
import ProtectedRoutes from "../layouts/protected-routes";
import Home from "../pages/home/home";
import Login from "../pages/login/login";
import PersistLogin from "../layouts/persist-login";
import Profile from "../pages/profile/profile";
import ForgotPassword from "../pages/forgot-password/forgot-passport";
import ResetPassword from "../pages/reset-password/reset-password";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Error />,
    children: [
      {
        element: <PersistLogin />,
        children: [
          {
            element: <PublicRoutes />,
            children: [
              {
                path: "login",
                element: <Login />,
              },
              {
                path: "signup",
                element: <Signup />,
              },
              {
                path: "forgot-password",
                element: <ForgotPassword />,
              },
              {
                path: "reset-password",
                element: <ResetPassword />,
              },
            ],
          },
          {
            element: <ProtectedRoutes />,
            children: [
              {
                path: "",
                element: <Home />,
              },
              {
                path: "profile",
                element: <Profile />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

export default router;
