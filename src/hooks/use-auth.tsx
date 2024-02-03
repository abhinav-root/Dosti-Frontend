import { useContext } from "react";
import { AuthContext } from "../contexts/auth-context";

export default function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthContextProvider");
  }
  return context;
}
