import axios from "axios";

const baseURL = import.meta.env.VITE_EXPRESS_APP_URL;

export const axiosPublic = axios.create({
  baseURL,
  withCredentials: true,
});

export const axiosPrivate = axios.create({
  baseURL,
  withCredentials: true,
});
