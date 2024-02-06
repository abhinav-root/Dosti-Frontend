import { useEffect } from "react";
import { axiosPrivate } from "../api/axios";
import useAuth from "./use-auth";
import useRefreshToken from "./use-refresh-token";

const useAxios = () => {
  const { auth } = useAuth();
  const refreshToken = useRefreshToken();

  useEffect(() => {
    const requestInterceptor = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response.status === 401 && !prevRequest.sent) {
          prevRequest.sent = true;
          const accessToken = await refreshToken();
          prevRequest.headers["Authorization"] = `Bearer ${accessToken}`;
          return axiosPrivate(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.response.eject(responseInterceptor);
      axiosPrivate.interceptors.request.eject(requestInterceptor);
    };
  }, [auth, refreshToken]);

  return axiosPrivate;
};

export default useAxios;
