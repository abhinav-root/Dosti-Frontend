import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { axiosPublic } from "../api/axios";
import endpoints from "../api/endpoints";
import useAuth from "../hooks/use-auth";
import { Box, CircularProgress } from "@mui/material";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  console.log("Inside persist login");
  const { auth, setAuth } = useAuth();
  console.log({ isLoading });
  const navigate = useNavigate()

  useEffect(() => {

    const myfunc = async () => {
      const response = await axiosPublic.get(endpoints.REFRESH, {
        withCredentials: true,
      });
      const { accessToken } = response.data;
      const profileResponse = await axiosPublic.get(endpoints.USER_PROFILE, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const profileData = profileResponse.data;
      const authData = { accessToken, ...profileData };
      setAuth(authData);
    };
    try {
      myfunc();
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  return (
    <div>
      {isLoading ? (
        <Box
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          height={"100vh"}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Outlet />
      )}
    </div>
  );
};

export default PersistLogin;
