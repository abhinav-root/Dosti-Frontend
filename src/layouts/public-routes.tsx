import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/use-auth";

const PublicRoutes = () => {
  console.log("Inside public");
  const { auth } = useAuth();

  console.log("inside public", auth?.accessToken);

  return <>{auth?.accessToken ? <Navigate to={"/"} /> : <Outlet />}</>;
};

export default PublicRoutes;
