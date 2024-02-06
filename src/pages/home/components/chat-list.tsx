import {
  Avatar,
  Badge,
  Box,
  Divider,
  Icon,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { formatRelative } from "date-fns";
import useAxios from "../../../hooks/use-axios";
import endpoints from "../../../api/endpoints";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import useAuth from "../../../hooks/use-auth";
import { getFullName, stringAvatar } from "../../../utils";
import {
  Chat,
  MessageStatus,
  User,
  setChats,
  updateSelectedChat,
} from "../../../redux/features/chats/chatsSlice";
import {
  LoadingLinear,
  OfflineBadge,
  OnlineBadge,
  getFriend,
} from "../../../components/common";
import { BiCheck, BiCheckDouble } from "react-icons/bi";
import { MdCallMade } from "react-icons/md";
import { MdCallReceived } from "react-icons/md";

const ChatList = () => {
  const { auth, setAuth } = useAuth();
  const dispatch = useDispatch();
  const chats = useSelector((state: RootState) => state.chats.chats);
  const onlineUsers = useSelector(
    (state: RootState) => state.onlineUsers.onlineUsers
  );
  const axios = useAxios();
  const [isLoading, setIsLoading] = useState(false);

  const fetchAllChats = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(endpoints.CHATS);
      const data = response.data;
      dispatch(setChats(data));
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllChats();
  }, []);

  const usersList = chats?.map((chat) => {
    const friend = getFriend(chat.users, auth?._id);
    const IsOnline = onlineUsers[friend?._id];
    console.log({ IsOnline, onlineUsers });
    const fullName = getFullName(friend?.firstName, friend?.lastName);
    const latestMessage = chat.latestMessage;
    const showTick = chat.latestMessage?.sender === auth?._id;
    const messageStatus = chat.messageStatus;
    const iconType =
      latestMessage && chat?.latestMessage?.sender === auth?._id
        ? MdCallMade
        : MdCallReceived;

    return (
      <Box
        key={chat._id}
        display={"flex"}
        flexDirection={"row"}
        alignItems={"center"}
        onClick={() => dispatch(updateSelectedChat(chat))}
        px={{sm: 15, md: 30}}
      >
        {IsOnline ? (
          <OnlineBadge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            variant="dot"
          >
            <Avatar
              {...stringAvatar(fullName)}
              src={friend?.profileImageUrl}
              sx={{ height: 42, width: 42, mr: 1 }}
            />
          </OnlineBadge>
        ) : (
          <OfflineBadge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            variant="dot"
          >
            <Avatar
              {...stringAvatar(fullName)}
              src={friend?.profileImageUrl}
              sx={{ height: 42, width: 42, mr: 1 }}
            />
          </OfflineBadge>
        )}

        <Box width={"100%"} pl={1}>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Typography
              textTransform={"capitalize"}
              component={"p"}
              fontWeight={600}
              color={grey[800]}
            >
              {fullName}
            </Typography>
            {}
            {latestMessage && (
              <Typography
                textTransform={"capitalize"}
                component={"p"}
                fontSize={12}
                color={
                  chat?.latestMessage?.sender !== auth?._id && chat.unread > 0
                    ? "primary.main"
                    : grey[600]
                }
              >
                {formatRelative(latestMessage?.createdAt, new Date())}
              </Typography>
            )}
          </Box>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Box display={"flex"} alignItems={"center"}>
              {latestMessage?.content && (
                <Icon
                  sx={{ fontSize: 18, mr: 1 }}
                  component={iconType}
                  color="action"
                />
              )}
              {latestMessage && (
                <Typography
                  textTransform={"capitalize"}
                  component={"p"}
                  fontSize={14}
                  color={grey[600]}
                  width={"85%"}
                  sx={{
                    display: "-webkit-box",
                    overflow: "hidden",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 2,
                  }}
                >
                  {latestMessage?.content}
                </Typography>
              )}
            </Box>
            {chat?.latestMessage?.sender !== auth?._id && (
              <Badge
                badgeContent={chat.unread}
                color="primary"
                sx={{ right: 10 }}
              />
            )}
          </Box>
        </Box>
      </Box>
    );
  });

  if (isLoading) {
    return <LoadingLinear />;
  }

  return (
    <Stack
      flexGrow={"1"}
      overflow={"auto"}
      px={2}
      py={2}
      spacing={3}
      divider={<Divider />}
    >
      {usersList?.length > 0 ? (
        usersList
      ) : (
        <Box my={2} color={grey[600]} textAlign={"center"}>
          Add friends to start chatting
        </Box>
      )}
    </Stack>
  );
};

export default ChatList;
