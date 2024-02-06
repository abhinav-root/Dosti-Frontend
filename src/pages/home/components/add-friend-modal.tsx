import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Avatar, Divider, Snackbar, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import useAxios from "../../../hooks/use-axios";
import endpoints from "../../../api/endpoints";
import { LoadingLinear } from "../../../components/common";
import { grey } from "@mui/material/colors";
import { getFullName } from "../../../utils";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { addNewChat } from "../../../redux/features/chats/chatsSlice";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  height: "80vh",
};

type AddFriendModalType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

type User = {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
};

export default function AddFriendModal({ open, setOpen }: AddFriendModalType) {
  const handleClose = () => setOpen(false);
  const [search, setSearch] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<string>("");
  const [users, setUsers] = useState<User[]>();
  const axios = useAxios();
  const chats = useSelector((state: RootState) => state.chats.chats);
  const dispatch = useDispatch();
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSnackbarClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const searchUsers = async () => {
    try {
      setIsError("");
      const response = await axios.get(endpoints.SEARCH_USERS, {
        params: { q: search },
      });
      const data = response.data;
      setUsers(data);
    } catch (err) {
      console.log(err);
      setIsError("Error occured while searching");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (search) {
      setIsLoading(true);
    } else {
        setUsers(undefined)
        setIsLoading(false)
    }
    const getData = setTimeout(() => {
      if (search) {
        searchUsers();
      }
    }, 1000);

    return () => {
      clearTimeout(getData);
    };
  }, [search]);

  const addFriend = async (id: string) => {
    try {
      const updated = users?.filter((user) => user._id !== id);
      setUsers(updated);
      const response = await axios.post(endpoints.CHATS, { friendId: id });
      const newChat = response.data.data;
      dispatch(addNewChat(newChat));
      setSnackbarOpen(true);
    } catch (error) {
      console.log(error);
    }
  };

  const UserList = () => {
    if (isLoading) {
      return <LoadingLinear />;
    }
    if (isError) {
      return (
        <Box color={"error.main"} display={"flex"} justifyContent={"center"}>
          Error occured while searching
        </Box>
      );
    }
    if (users?.length === 0) {
      return (
        <Box display={"flex"} justifyContent={"center"}>
          No results found
        </Box>
      );
    }
    return users?.map((user) => {
      const fullName = getFullName(user.firstName, user.lastName);
      const isFriend = chats.some((chat) => {
        return chat.users.find((u) => u._id === user._id);
      });
      return (
        <Box
          display={"flex"}
          px={2}
          justifyContent={"space-between"}
          alignItems={"center"}
          my={3}
          key={user._id}
        >
          <Box display={"flex"} alignItems={"center"}>
            <Avatar
              src=""
              sx={{
                height: 36,
                width: 36,
                mr: 2,
                display: { xs: "none", sm: "flex" },
              }}
            />
            <Typography fontWeight={600} color={grey[800]} fontSize={16}>
              {fullName}
            </Typography>
          </Box>

          {!isFriend && (
            <Button
              size="small"
              variant="contained"
              onClick={() => addFriend(user._id)}
            >
              Add
            </Button>
          )}
        </Box>
      );
    });
  };

  return (
    <div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        message="Friend added"
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        // sx={{width: 300}}
      />
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Box
              display={"flex"}
              flexDirection={"column"}
              height={"100%"}
              sx={{ width: { xs: 280, sm: 400 } }}
            >
              <Box flexShrink={0}>
                <Typography
                  id="transition-modal-title"
                  variant="h5"
                  component="h2"
                  fontWeight={600}
                  mb={1}
                >
                  Add friends
                </Typography>
                <TextField
                  placeholder="Search users"
                  size="small"
                  fullWidth
                  variant="outlined"
                  autoComplete="off"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </Box>
              <Box flexGrow={1} overflow={"auto"} my={2} bgcolor={grey[100]}>
                <UserList />
              </Box>
              <Box flexShrink={0} display={"flex"} justifyContent={"flex-end"}>
                <Button variant="contained" onClick={() => setOpen(false)}>
                  Close
                </Button>
              </Box>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
