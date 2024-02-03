import { Box } from "@mui/material";
import { grey } from "@mui/material/colors";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import useAuth from "../hooks/use-auth";

const Root = () => {
  const { auth } = useAuth();
  console.log("Inside root");
  console.log("auth", auth);

  useEffect(() => {}, []);

  return (
    <Box height={"100vh"} width={"100vw"} bgcolor={grey[200]}>
      <Outlet />
    </Box>
  );
};

export default Root;
