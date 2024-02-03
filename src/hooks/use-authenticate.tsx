import { useNavigate } from "react-router-dom";
import { axiosPublic } from "../api/axios";
import endpoints from "../api/endpoints";
import useAuth from "./use-auth";
import { AxiosError } from "axios";

function useAuthenticate() {
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const authenticate = async () => {
    try {
      console.log("Getting new access token");
      const refreshTokenResponse = await axiosPublic.get(endpoints.REFRESH, {
        withCredentials: true,
      });
      const accessToken = refreshTokenResponse.data?.accessToken;
      console.log("accessToken", accessToken);

      const userProfileResponse = await axiosPublic.get(
        endpoints.USER_PROFILE,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const userProfile = userProfileResponse.data;
      const auth = { accessToken, ...userProfile };
      setAuth(auth);
      return auth;
    } catch (error: unknown) {
      console.log("Error occured while authenticating user", error);
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

  return authenticate;
}

export default useAuthenticate;
