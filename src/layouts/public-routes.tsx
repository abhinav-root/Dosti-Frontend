import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import useAuth from "../hooks/use-auth";

const PublicRoutes = () => {
  console.log("Inside public");
  const { auth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth) {
      navigate("/");
    }
  }, [auth, navigate]);

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default PublicRoutes;
