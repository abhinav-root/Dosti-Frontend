import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import useAuthenticate from "../hooks/use-authenticate";

const PersistLogin = () => {
  console.log("Inside persist login");
  const authenticate = useAuthenticate();

  useEffect(() => {
    const authenticateUser = async () => {
      await authenticate();
    };

    authenticateUser();
  }, []);
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default PersistLogin;
