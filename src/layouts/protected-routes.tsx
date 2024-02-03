import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import useAuth from "../hooks/use-auth";

const ProtectedRoutes = () => {
  console.log("Inside protected");
  const { auth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth) {
      navigate("/login", { replace: true });
    }
  }, [auth, navigate]);

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default ProtectedRoutes;
