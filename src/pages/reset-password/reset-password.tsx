import { zodResolver } from "@hookform/resolvers/zod";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Alert,
  Box,
  Container,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  Link,
  OutlinedInput,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Link as RouterLink,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import useAxios from "../../hooks/use-axios";
import endpoints from "../../api/endpoints";
import { isAxiosError } from "axios";
import useRefreshToken from "../../hooks/use-refresh-token";
import useAuth from "../../hooks/use-auth";

const schema = z.object({
  password: z.string().min(8).max(50),
});

type FieldValues = z.infer<typeof schema>;

const ResetPassword = () => {
  const axios = useAxios();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FieldValues>({ resolver: zodResolver(schema) });
  const location = useLocation();
  const queryParams = location.search.split("&");
  const token = queryParams[0].split("=")[1];
  const id = queryParams[1].split("=")[1];
  const [showToast, setShowToast] = useState(false);

  const onSubmitHandler: SubmitHandler<FieldValues> = async (data) => {
    try {
      setIsLoading(true);
      await axios.post(endpoints.RESET_PASSWORD, {
        ...data,
        userId: id,
        token,
      });
      setShowToast(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      if (isAxiosError(err)) {
        setError("root", {
          message: err?.response?.data?.message || "Server error",
        });
      }
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box bgcolor={"primary.main"}>
      <Snackbar
        open={showToast}
        anchorOrigin={{ horizontal: "center", vertical: "top" }}
        autoHideDuration={3000}
        onClose={() => setShowToast(false)}
        message="Password reset successfully. Redirecting to login page"
      />
      <Container>
        <Box
          component={"main"}
          height={"100vh"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Box
            component={"form"}
            bgcolor={"white"}
            py={4}
            px={4}
            borderRadius={2}
            boxShadow={4}
            maxWidth={400}
            minWidth={300}
            flexGrow={1}
            onSubmit={handleSubmit(onSubmitHandler)}
          >
            <Stack spacing={2} direction={"column"}>
              <Typography
                variant="h5"
                component="h1"
                textAlign={"center"}
                fontWeight={600}
                gutterBottom
              >
                Reset your password
              </Typography>
              {showToast && <Typography
                component="p"
                textAlign={"center"}
                fontWeight={500}
                gutterBottom
              >
                Password changed. Use your new password to login.
              </Typography>}
              {errors?.root?.message && (
                <Alert severity="error">{errors?.root?.message}</Alert>
              )}

              {!showToast && (
                <FormControl
                  variant="outlined"
                  error={Boolean(errors?.password?.message)}
                >
                  <InputLabel htmlFor="outlined-adornment-password">
                    Enter New Password
                  </InputLabel>
                  <OutlinedInput
                    autoComplete="off"
                    fullWidth
                    id="outlined-adornment-password"
                    type={showPassword ? "text" : "password"}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Enter New Password"
                    {...register("password")}
                  />
                  <FormHelperText>{errors?.password?.message}</FormHelperText>
                </FormControl>
              )}
              {!showToast && (
                <LoadingButton
                  loading={isLoading}
                  variant="contained"
                  size="large"
                  type="submit"
                >
                  <span>Submit</span>
                </LoadingButton>
              )}
            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ResetPassword;
