import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  Link,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import useAuth from "../../hooks/use-auth";
import { getFullName, stringAvatar } from "../../utils";
import { grey } from "@mui/material/colors";
import ChatList from "./components/chat-list";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import SelectedChat from "./components/selected-chat";
import { useEffect, useState } from "react";
import useSocket from "../../hooks/use-socket";
import { pushMessage } from "../../redux/features/messages/messgesSlice";
import { setLatestMessage } from "../../redux/features/chats/chatsSlice";
import { setOnlineUsers } from "../../redux/features/online-users/onlineUsersSlice";
import AddIcon from "@mui/icons-material/Add";
import AddFriendModal from "./components/add-friend-modal";
import useAxios from "../../hooks/use-axios";
import endpoints from "../../api/endpoints";
import { useNavigate } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";

const Home = () => {
  const { auth, setAuth } = useAuth();
  const fullName = getFullName(auth?.firstName, auth?.lastName);
  const selectedChat = useSelector(
    (state: RootState) => state.chats.selectedChat
  );
  const { socket, setSocket } = useSocket();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);
  const axios = useAxios();
  const navigate = useNavigate();
  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event?.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const messageHandler = (msg) => {
      dispatch(setLatestMessage({ chatId: msg?.chat, latestMessage: msg }));
    };
    socket?.on("message", messageHandler);

    const onlineUsersHandler = (data) => {
      console.log({ onlineUsers: data });
      dispatch(setOnlineUsers(data));
    };
    socket?.on("online-users", onlineUsersHandler);

    return () => {
      socket?.off("message", messageHandler);
    };
  }, [socket]);


  if (selectedChat) {
    return <SelectedChat />;
  }

  const logoutUser = async () => {
    handleMenuClose();
    await axios.delete(endpoints.LOGOUT);
    setAuth(null);
    navigate("/login");
  };

  return (
    <Box
      height={"100vh"}
      bgcolor={"white"}
      display={"flex"}
      flexDirection={"column"}
      flexWrap={"nowrap"}
    >
      <Box
        display={"flex"}
        alignItems={"center"}
        component={"header"}
        bgcolor={grey[100]}
        flexShrink={0}
        justifyContent={"space-between"}
        px={{xs: 2, sm: 15, md: 30}}
        py={{xs: 2, sm: .5}}
      >
        <Box display={"flex"} alignItems={"center"}>
          <Button onClick={handleMenuClick}>
            <Avatar
              {...stringAvatar(fullName)}
              src={auth?.profileImageUrl}
              sx={{ height: 56, width: 56, mr: 2 }}
            />
          </Button>
          <Typography fontWeight={600} color={grey[900]} fontSize={18}>
            {fullName}
          </Typography>
        </Box>
        <Button
          size="small"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          Friend
        </Button>
      </Box>
      <Box px={{xs: 2, sm: 15, md: 30}} flexShrink={0} my={1}>
        <Typography component={"h1"} variant="h5" fontWeight={600}>
          Chats
        </Typography>
      </Box>
      <ChatList />
      <AddFriendModal open={open} setOpen={setOpen} />
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem>
          <Link component={RouterLink} to={"/profile"} sx={{color: grey[800], textDecoration: "none"}}>
            Profile
          </Link>
        </MenuItem>
        <MenuItem onClick={logoutUser}>Logout</MenuItem>
      </Menu>
    </Box>
  );
};

export default Home;
