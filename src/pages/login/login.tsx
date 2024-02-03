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
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import LoadingButton from "@mui/lab/LoadingButton";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import endpoints from "../../api/endpoints";
import { isAxiosError } from "axios";
import { axiosPublic } from "../../api/axios";
import useAuthenticate from "../../hooks/use-authenticate";

const schema = z.object({
  email: z.string().email().trim(),
  password: z.string().min(8).max(50),
});

type FieldValues = z.infer<typeof schema>;

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const authenticate = useAuthenticate();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FieldValues>({ resolver: zodResolver(schema) });

  const onSubmitHandler: SubmitHandler<FieldValues> = async (data) => {
    try {
      setIsLoading(true);
      await axiosPublic.post(endpoints.LOGIN, data);
      await authenticate();
      navigate("/", { replace: true });
    } catch (err) {
      if (isAxiosError(err)) {
        if (err.response?.status === 400) {
          const data = err.response?.data;
          console.log("data", data);
          setError("email", { message: data?.email?.msg });
          setError("password", { message: data?.password?.msg });
        } else if (err.response?.status === 401) {
          setError("root", { message: "Invalid credentials" });
        } else {
          setError("root", {
            message: err?.response?.data?.message || "Server error",
          });
        }
      }
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box bgcolor={"primary.main"}>
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
                Login
              </Typography>
              {errors?.root?.message && (
                <Alert severity="error">{errors?.root?.message}</Alert>
              )}
              <TextField
                autoFocus
                error={Boolean(errors.email?.message)}
                label="Email"
                helperText={errors?.email?.message}
                fullWidth
                {...register("email")}
              />
              <FormControl
                variant="outlined"
                error={Boolean(errors?.password?.message)}
              >
                <InputLabel htmlFor="outlined-adornment-password">
                  Password
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
                  label="Password"
                  {...register("password")}
                />
                <FormHelperText>{errors?.password?.message}</FormHelperText>
              </FormControl>
              <LoadingButton
                loading={isLoading}
                variant="contained"
                size="large"
                type="submit"
              >
                <span>Login</span>
              </LoadingButton>
            </Stack>
            <Typography mt={4} textAlign={"center"} component={"p"}>
              Don't have an account?{" "}
              <Link component={RouterLink} to={"/signup"}>
                Signup
              </Link>
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;
