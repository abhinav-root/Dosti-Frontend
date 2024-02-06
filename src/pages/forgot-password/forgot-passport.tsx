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
import endpoints from "../../api/endpoints";
import { isAxiosError } from "axios";
import { axiosPublic } from "../../api/axios";

const schema = z.object({
  email: z.string().email().trim(),
});

type FieldValues = z.infer<typeof schema>;

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FieldValues>({ resolver: zodResolver(schema) });

  const onSubmitHandler: SubmitHandler<FieldValues> = async (data) => {
    try {
      setIsLoading(true);
      await axiosPublic.post(endpoints.FORGOT_PASSWORD, data);
      setIsSuccess(true)
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
                Forgot Password
              </Typography>
              {!isSuccess && <Typography
                component="p"
                textAlign={"left"}
                fontWeight={500}
                gutterBottom
              >
                Please enter your email address. You will receive a link to create a new password.
              </Typography>}
              {isSuccess && <Typography
                component="h6"
                textAlign={"center"}
                fontWeight={500}
                gutterBottom
              >
                A reset password link has been send to your email. Make sure to check your spam folder. 
              </Typography>}
              {errors?.root?.message && (
                <Alert severity="error">{errors?.root?.message}</Alert>
              )}
              {!isSuccess && <TextField
                autoFocus
                error={Boolean(errors.email?.message)}
                label="Email"
                helperText={errors?.email?.message}
                fullWidth
                {...register("email")}
              />}

              {!isSuccess && <LoadingButton
                loading={isLoading}
                variant="contained"
                size="large"
                type="submit"
              >
                <span>Continue</span>
              </LoadingButton>}
            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ForgotPassword;
