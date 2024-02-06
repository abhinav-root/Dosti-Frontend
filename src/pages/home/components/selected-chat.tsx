import {
  Avatar,
  Box,
  Button,
  Icon,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { getFullName, stringAvatar } from "../../../utils";
import { LoadingLinear, getFriend } from "../../../components/common";
import useAuth from "../../../hooks/use-auth";
import { blue, grey } from "@mui/material/colors";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { IoMdArrowBack } from "react-icons/io";
import {
  Message,
  clearSelectedChat,
  updateSelectedChat,
} from "../../../redux/features/chats/chatsSlice";
import useAxios from "../../../hooks/use-axios";
import endpoints from "../../../api/endpoints";
import {
  clearAllMessages,
  pushMessage,
  pushMessages,
} from "../../../redux/features/messages/messgesSlice";
import { useEffect, useRef, useState } from "react";
import useSocket from "../../../hooks/use-socket";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteChatDialog from "./delete-chat-dialog";

const SelectedChat = () => {
  const axios = useAxios();
  const dispatch = useDispatch();
  const { auth } = useAuth();
  const selectedChat = useSelector(
    (state: RootState) => state.chats.selectedChat
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isMessageSending, setIsMessageSending] = useState(false);
  const friend = getFriend(selectedChat.users, auth?._id);
  console.log({ friend });
  const fullName = getFullName(friend?.firstName, friend?.lastName);
  const messages = useSelector(
    (state: RootState) => state.messages.selectedChatMessages
  );
  const [pageNo, setPageNo] = useState(1);
  const [lastFetchedMessages, setLastFetchedMessages] = useState<
    Message[] | null
  >(null);
  const [message, setMessage] = useState("");
  const scrollBottom = useRef(null);
  const { socket } = useSocket();
  const [dialogOpen, dialogClose] = useState(false);

  const handleDialogOpen = () => {
    dialogClose(true);
  };

  const handleDialogClose = () => {
    dialogClose(false);
  };

  useEffect(() => {
    axios.patch(endpoints.READ_MESSAGES, { chatId: selectedChat?._id });
  }, []);
  // useEffect(() => {
  //   scrollBottom?.current?.scrollIntoView({ behavior: "smooth" });
  // }, [messages]);

  useEffect(() => {
    scrollBottom?.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const messageList = messages?.map((message) => {
    return (
      <Box
        key={message._id}
        my={2}
        display={"flex"}
        flexDirection={"row"}
        justifyContent={
          message?.sender == auth?._id ? "flex-end" : "flex-start"
        }
      >
        <Typography
          sx={{ maxWidth: "80%" }}
          component={"p"}
          py={0.5}
          px={1.5}
          borderRadius={2}
          color={"white"}
          bgcolor={message?.sender === auth?._id ? blue[700] : grey[600]}
        >
          {message.content}
        </Typography>
      </Box>
    );
  });

  const loadMessages = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        endpoints.MESSAGES + "/" + selectedChat?._id,
        { params: { pageNo, limit: 25 } }
      );
      const data = response.data;
      dispatch(pushMessages(data));
      setLastFetchedMessages(data);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [pageNo]);

  if (isLoading) {
    return <LoadingLinear />;
  }

  const sendMessage = async () => {
    try {
      setIsMessageSending(true);
      const response = await axios.post(endpoints.MESSAGES, {
        chatId: selectedChat?._id,
        senderId: auth?._id,
        content: message,
      });
      const data = response.data;
      dispatch(pushMessage(data));
      setMessage("");
    } catch (error) {
      console.log(error);
    } finally {
      setIsMessageSending(false);
    }
  };

  const onChatClose = () => {
    dispatch(clearSelectedChat());
    dispatch(clearAllMessages());
  };

  return (
    <Box
      height={"100vh"}
      bgcolor={"white"}
      display={"flex"}
      flexDirection={"column"}
      flexWrap={"nowrap"}
      px={{sm: 15, md: 30}}
    >
      <Box
        component={"nav"}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
        px={1}
        py={1.5}
        bgcolor={grey[100]}
        flexShrink={0}
      >
        <Icon color="primary" component={IoMdArrowBack} onClick={onChatClose} />
        <Box display={"flex"} alignItems={"center"}>
          <Avatar
            {...stringAvatar(fullName)}
            src={friend?.profileImageUrl}
            sx={{ height: 42, width: 42, mr: 2 }}
          />
          <Typography fontWeight={600} color={grey[800]} fontSize={18}>
            {fullName}
          </Typography>
        </Box>

        <DeleteIcon color="error" onClick={handleDialogOpen} />
      </Box>
      <Stack
        flexGrow={1}
        overflow={"auto"}
        display={"flex"}
        flexDirection={"column"}
        px={2}
        sx={{ overflowX: "hidden" }}
      >
        <Button
          disabled={lastFetchedMessages?.length === 0}
          onClick={() => {
            setPageNo((no) => no + 1);
          }}
        >
          see more
        </Button>
        {messageList}
        <div ref={scrollBottom} />
      </Stack>
      <Box
        px={1}
        display={"flex"}
        flexShrink={0}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <TextField
          autoComplete="off"
          placeholder="Enter a message"
          variant="outlined"
          size="small"
          sx={{ width: "75%" }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <LoadingButton
          loading={isMessageSending}
          variant="contained"
          onClick={sendMessage}
          disabled={!message}
        >
          <span>send</span>
        </LoadingButton>
      </Box>
      <DeleteChatDialog
        dialogOpen={dialogOpen}
        handleDialogOpen={handleDialogOpen}
        handleDialogClose={handleDialogClose}
      />
    </Box>
  );
};

export default SelectedChat;
