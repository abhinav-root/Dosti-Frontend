import { createBrowserRouter } from "react-router-dom";
import Root from "../layouts/root";
import Error from "../pages/error/error";
import Signup from "../pages/signup/signup";
import PublicRoutes from "../layouts/public-routes";
import ProtectedRoutes from "../layouts/protected-routes";
import Home from "../pages/home/home";
import Login from "../pages/login/login";
import PersistLogin from "../layouts/persist-login";

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
            ],
          },
          {
            element: <ProtectedRoutes />,
            children: [
              {
                path: "",
                element: <Home />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

export default router;
