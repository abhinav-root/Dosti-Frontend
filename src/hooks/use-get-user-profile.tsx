import { useNavigate } from "react-router-dom";
import { axiosPublic } from "../api/axios";
import endpoints from "../api/endpoints";
import useAuth from "./use-auth";
import { AxiosError } from "axios";
import useAxios from "./use-axios";

function useGetUserProfile() {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const axios = useAxios()

  const getUserProfile = async () => {
    try {
      console.log("Getting user profile");
      const response = await axios.get(endpoints.USER_PROFILE, {
        withCredentials: true,
      });
      const userProfile = response.data;
      console.log("userProfile", userProfile);
      return userProfile;
    } catch (error: unknown) {
      console.log("Error getting user profile", error);
    }
  };

  return getUserProfile;
}

export default useGetUserProfile;
