import { useNavigate } from "react-router-dom";
import { axiosPublic } from "../api/axios";
import endpoints from "../api/endpoints";
import useAuth from "./use-auth";
import { AxiosError } from "axios";

function useRefreshToken() {
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const getRefreshToken = async () => {
    try {
      console.log("Getting new access token");
      const response = await axiosPublic.get(endpoints.REFRESH, {
        withCredentials: true,
      });
      const accessToken = response.data?.accessToken;
      console.log("accessToken", accessToken);
      return accessToken;
    } catch (error: unknown) {
      console.log("Error getting refresh token", error);
      if (error instanceof AxiosError) {
        if (
          error.response?.config?.url?.includes("refresh") &&
          error.response.status === 401
        ) {
          setAuth(null);
          navigate("/login");
        }
      }
    }
  };

  return getRefreshToken;
}

export default useRefreshToken;
