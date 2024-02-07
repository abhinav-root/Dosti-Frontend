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
import { Link as RouterLink } from "react-router-dom";
import useAxios from "../../hooks/use-axios";
import endpoints from "../../api/endpoints";
import { isAxiosError } from "axios";
import useRefreshToken from "../../hooks/use-refresh-token";

const schema = z.object({
  firstName: z.string().min(1).max(50).trim(),
  lastName: z.string().min(1).max(50).trim(),
  email: z.string().email().trim(),
  password: z.string().min(8).max(50),
});

type FieldValues = z.infer<typeof schema>;

const Signup = () => {
  const axios = useAxios();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const authenticate = useRefreshToken();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FieldValues>({ resolver: zodResolver(schema) });

  const onSubmitHandler: SubmitHandler<FieldValues> = async (data) => {
    try {
      setIsLoading(true);
      await axios.post(endpoints.SIGNUP, data);
      await axios.post(endpoints.LOGIN, data);
      await authenticate();
    } catch (err) {
      if (isAxiosError(err)) {
        if (err.response?.status === 400) {
          const data = err.response?.data;
          console.log("data", data);
          setError("firstName", { message: data?.firstName?.msg });
          setError("lastName", { message: data?.lastName?.msg });
          setError("email", { message: data?.email?.msg });
          setError("password", { message: data?.password?.msg });
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
                Create your account
              </Typography>
              {errors?.root?.message && (
                <Alert severity="error">{errors?.root?.message}</Alert>
              )}
              <TextField
                autoFocus
                error={Boolean(errors.firstName?.message)}
                label="First Name"
                helperText={errors?.firstName?.message}
                fullWidth
                {...register("firstName")}
              />
              <TextField
                error={Boolean(errors.lastName?.message)}
                label="Last Name"
                helperText={errors?.lastName?.message}
                fullWidth
                {...register("lastName")}
              />
              <TextField
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
                <span>Signup</span>
              </LoadingButton>
            </Stack>
            <Typography mt={4} textAlign={"center"} component={"p"}>
              Already a user?{" "}
              <Link component={RouterLink} to={"/login"}>
                Login
              </Link>
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Signup;
