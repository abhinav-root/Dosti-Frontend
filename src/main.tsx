import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./routes/router";
import { CssBaseline } from "@mui/material";
import AuthContextProvider from "./contexts/auth-context";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import SocketContextProvider from "./contexts/socket-context";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    <CssBaseline />
    <AuthContextProvider>
      <Provider store={store}>
        <SocketContextProvider>
          <RouterProvider router={router} />
        </SocketContextProvider>
      </Provider>
    </AuthContextProvider>
  </>
);
