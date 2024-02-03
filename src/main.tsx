import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./routes/router";
import { CssBaseline } from "@mui/material";
import AuthContextProvider from "./contexts/auth-context";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    <CssBaseline />
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  </>
);
