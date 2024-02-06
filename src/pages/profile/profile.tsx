import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Icon,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { grey } from "@mui/material/colors";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import EmailIcon from "@mui/icons-material/Email";
import Diversity1Icon from "@mui/icons-material/Diversity1";
import { ChangeEvent, useEffect, useState } from "react";
import useAxios from "../../hooks/use-axios";
import endpoints from "../../api/endpoints";
import LoadingButton from "@mui/lab/LoadingButton";
import { useNavigate } from "react-router-dom";
import { LoadingLinear } from "../../components/common";
import { User } from "../../redux/features/chats/chatsSlice";
import { IoMdArrowBack } from "react-icons/io";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const Profile = () => {
  const axios = useAxios();
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const handleSnackbarClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const getUserProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(endpoints.USER_PROFILE);
      setUser(response.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      setIsUploading(true);
      const file = e.target.files?.[0];
      const formData = new FormData();
      formData.append("image", file);
      const response = await axios.post(endpoints.PROFILE_IMAGE, formData);
      setSnackbarOpen(true);
      e.target.value = null;
      setUser((prev) => ({ ...prev, profileImageUrl: response.data?.url }));
      window.location.replace('/')
    } catch (err) {
      console.log(err);
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) {
    return <LoadingLinear />;
  }

  return (
    <Box bgcolor={grey[50]} height={"100vh"} py={2}>
      <Box px={3}>
        <Icon
          color="primary"
          component={IoMdArrowBack}
          onClick={() => navigate("/")}
          sx={{fontSize: 28}}
        />
      </Box>
      <Box
        display={"flex"}
        justifyContent={"center"}
        flexDirection={"column"}
        alignItems={"center"}
        mb={10}
      >
        <Avatar
          alt={user?.firstName + " " + user?.lastName}
          src={user?.profileImageUrl ?? ""}
          sx={{ width: 250, height: 250, mb: 3 }}
        />
        <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
            disabled={isUploading}
            sx={{ mr: 1 }}
          >
            Upload Photo
            <VisuallyHiddenInput
              onChange={handleFileUpload}
              type="file"
              accept=".png, .jpg, .jpeg"
            />
          </Button>
          {isUploading && <CircularProgress size={28} />}
        </Box>
      </Box>
      <Box
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"center"}
        px={5}
      >
        <Box display={"flex"} mb={3}>
          <PersonIcon color="primary" sx={{ mr: 1 }} />
          <Typography mr={5}>Name</Typography>
          <Typography color={grey[600]}>
            {user?.firstName + " " + user?.lastName}
          </Typography>
        </Box>
        <Box display={"flex"} mb={3}>
          <EmailIcon color="primary" sx={{ mr: 1 }} />
          <Typography mr={5}>Email</Typography>
          <Typography color={grey[600]}>{user?.email}</Typography>
        </Box>
        <Box display={"flex"}>
          <Diversity1Icon color="primary" sx={{ mr: 1 }} />
          <Typography mr={5}>Friends</Typography>
          <Typography color={grey[600]}>{user?.friends}</Typography>
        </Box>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message="Profile Image Uploaded"
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        // sx={{width: 300}}
      />
    </Box>
  );
};

export default Profile;
