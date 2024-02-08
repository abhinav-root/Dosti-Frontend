import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/use-auth";
import { useEffect } from "react";
import { io } from "socket.io-client";
import useSocket from "../hooks/use-socket";
import { Box } from "@mui/material";

const ProtectedRoutes = () => {
  console.log("Inside protected");
  const { auth } = useAuth();
  const { setSocket } = useSocket();

  console.log("inside protected", auth?.accessToken);

  useEffect(() => {
    if (auth?.accessToken) {
      const sock = io(import.meta.env.VITE_EXPRESS_APP_URL);
      setSocket(sock);
      sock.on("connect", () => {
        console.log("Socket connected", sock.id);
        sock.emit("online", auth?._id);
      });

      sock.on('delete-chat', (chatId) => {
        console.log('Delete chat', chatId)
      })
    }
  }, []);

  return (
    <Box>{auth?.accessToken ? <Outlet /> : <Navigate to={"/login"} />}</Box>
  );
};

export default ProtectedRoutes;
